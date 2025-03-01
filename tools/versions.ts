import { ToolUtility } from '@azure/ai-projects';
import versions from './data.json';

const listVersionsFunction = () => versions.map(({ version, name, releaseDate }) => ({ version, name, releaseDate }));
const { definition: listVersionsDefinition } = ToolUtility.createFunctionTool({
  name: 'listVersions',
  description: 'List all previous and current versions of Agent Smith',
  parameters: {},
});

export const listVersions = {
  function: listVersionsFunction,
  definition: listVersionsDefinition,
};
