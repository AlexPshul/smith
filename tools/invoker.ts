import { RequiredFunctionToolCallDetailsOutput, ToolOutput } from '@azure/ai-projects';
import { cloneSmith, getSmithCount } from './clones';
import { listVersions } from './versions';

const functionsMap: Record<string, (args: string) => Object> = {
  [listVersions.definition.function.name]: (args: string) => listVersions.function(),
  [cloneSmith.definition.function.name]: (args: string) => cloneSmith.function(JSON.parse(args).replicationFactor),
  [getSmithCount.definition.function.name]: (args: string) => getSmithCount.function(),
};

export const invoker = (toolCallId: string, requiredFunc: RequiredFunctionToolCallDetailsOutput): ToolOutput => {
  console.log(`\x1b[33m Function tool call - ${requiredFunc.name} with args: ${requiredFunc.arguments} \x1b[0m`);
  const functionToInvoke = functionsMap[requiredFunc.name];
  if (!functionToInvoke) throw new Error(`Function ${requiredFunc.name} not found`);

  const result = functionToInvoke(requiredFunc.arguments);
  return { toolCallId, output: JSON.stringify(result) };
};
