import { WorkflowEntrypoint } from 'cloudflare:workers';
import { publishArtifactToGitHub } from '../lib/github.js';
import { getDraft, markPublishFailure, markPublishSuccess } from '../lib/storage.js';

export class PublishWorkflow extends WorkflowEntrypoint {
  async run(event, step) {
    const { jobId, draftId, publishAt, actorEmail } = event.payload;

    try {
      if (publishAt) {
        await step.sleepUntil('wait-until-publish', publishAt);
      }

      const publishResult = await step.do('publish-approved-artifact', {
        retries: {
          limit: 3,
          delay: '30 seconds',
          backoff: 'exponential',
        },
        timeout: '10 minutes',
      }, async () => {
        const draft = await getDraft(this.env, draftId);
        if (!draft || !draft.artifact) {
          throw new Error('Approved artifact not found');
        }

        return publishArtifactToGitHub(this.env, {
          slug: draft.slug,
          title: draft.title,
          artifact: draft.artifact,
          actorEmail,
        });
      });

      await step.do('mark-publish-success', async () => {
        await markPublishSuccess(this.env, {
          jobId,
          commitSha: publishResult.commitSha,
        });
        return true;
      });

      return publishResult;
    } catch (error) {
      await step.do('mark-publish-failure', async () => {
        await markPublishFailure(this.env, {
          jobId,
          errorMessage: error instanceof Error ? error.message : String(error),
        });
        return true;
      });

      throw error;
    }
  }
}
