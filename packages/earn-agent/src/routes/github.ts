import { Router, Request, Response } from 'express';
import { generateContextQueue } from '../queues';
import { z } from 'zod';

const router = Router();

const reviewRequestSchema = z.object({
  submissionUrl: z.string().url(),
  bountyId: z.string(),
  bountyRequirements: z.string(),
});

router.post('/review', async (req: Request, res: Response) => {
  try {
    const { submissionUrl, bountyId, bountyRequirements } = reviewRequestSchema.parse(req.body);

    // Queue the context generation job
    await generateContextQueue.add('generate-context', {
      submissionUrl,
      bountyId,
      bountyRequirements,
    });

    res.json({
      success: true,
      message: 'Review process initiated',
      submissionUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    console.error('Error initiating review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate review',
    });
  }
});

// GET endpoint to retrieve review results
router.get('/review/:submissionUrl/:bountyId', async (req: Request, res: Response) => {
  try {
    const { submissionUrl, bountyId } = req.params;
    const { getReviewResults } = await import('../database/reviews');
    
    const result = await getReviewResults(
      decodeURIComponent(submissionUrl),
      bountyId
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch review',
    });
  }
});

export { router as githubReviewRouter };
