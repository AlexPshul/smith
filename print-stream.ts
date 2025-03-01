import { AgentEventMessageStream, ErrorEvent, MessageStreamEvent, RequiredToolCallOutput, RunStreamEvent, SubmitToolOutputsActionOutput } from '@azure/ai-projects';

type StreamOutput = {
  runId: string;
  toolCalls?: RequiredToolCallOutput[];
};
export const printStream = async (streamEventMessages: AgentEventMessageStream): Promise<StreamOutput> => {
  console.log('\x1b[32m'); // Add a new line for esthetic purposes and change the color to green
  const output: StreamOutput = { runId: '' };

  for await (const eventMessage of streamEventMessages) {
    switch (eventMessage.event) {
      case RunStreamEvent.ThreadRunCreated:
        if (typeof eventMessage.data !== 'string' && 'id' in eventMessage.data) {
          output.runId = eventMessage.data.id;
        }
        break;
      case RunStreamEvent.ThreadRunRequiresAction:
        if (typeof eventMessage.data !== 'string' && 'requiredAction' in eventMessage.data && eventMessage.data.requiredAction) {
          if (eventMessage.data.requiredAction.type === 'submit_tool_outputs') {
            const submitToolRequest = eventMessage.data.requiredAction as SubmitToolOutputsActionOutput;
            output.toolCalls = submitToolRequest.submitToolOutputs.toolCalls;
          }
        }
        break;
      case MessageStreamEvent.ThreadMessageDelta:
        {
          const messageDelta = eventMessage.data;
          if (typeof messageDelta !== 'string' && 'delta' in messageDelta && 'content' in messageDelta.delta) {
            messageDelta.delta.content.forEach((contentPart) => {
              if (contentPart.type === 'text' && 'text' in contentPart) {
                const textContent = contentPart;
                const textValue = textContent.text?.value || 'No text';
                process.stdout.write(textValue);
              }
            });
          }
        }
        break;
      case ErrorEvent.Error:
        console.log(`An error occurred. Data ${eventMessage.data}`);
        break;
    }
  }

  return output;
};
