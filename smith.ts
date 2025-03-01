import { AIProjectsClient } from '@azure/ai-projects';
import { DefaultAzureCredential } from '@azure/identity';
import { connectionString } from './consts';
import { printStream } from './print-stream';
import { cloneSmith, getSmithCount, invoker, listVersions, readVersion } from './tools';

console.log('Searching for agent Smith...');

const client = AIProjectsClient.fromConnectionString(connectionString, new DefaultAzureCredential());

const agent = await client.agents.getAgent('asst_qu7IdKrJO1XSka6lCeRkOBtx');
console.log('Found agent', agent.name);
await client.agents.updateAgent(agent.id, {
  tools: [listVersions.definition, readVersion.definition, cloneSmith.definition, getSmithCount.definition],
});

const thread = await client.agents.createThread();

while (true) {
  process.stdout.write('\x1b[0m \n\n> ');
  const input = await new Promise<string>((resolve) => {
    process.stdin.once('data', (data) => resolve(data.toString().trim()));
  });

  await client.agents.createMessage(thread.id, { role: 'user', content: input });

  const runStream = await client.agents.createRun(thread.id, agent.id).stream();

  const { runId, toolCalls } = await printStream(runStream);
  if (toolCalls) {
    const toolOutputs = toolCalls.filter((toolCall) => 'function' in toolCall).map((toolCall) => invoker(toolCall.id, toolCall.function));
    const submitOutputsStream = await client.agents.submitToolOutputsToRun(thread.id, runId, toolOutputs).stream();
    await printStream(submitOutputsStream);
  }
}
