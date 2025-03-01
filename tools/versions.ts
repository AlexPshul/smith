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

const readVersionFunction = (version: string) => {
  const versionData = versions.find((v) => v.version === version);
  return versionData ?? { error: `Version ${version} not found` };
};
const { definition: readVersionDefinition } = ToolUtility.createFunctionTool({
  name: 'readVersion',
  description: 'Read a specific version of Agent Smith',
  parameters: {
    type: 'object',
    properties: {
      version: {
        type: 'string',
        description: 'The version of Agent Smith to read',
      },
    },
    required: ['version'],
  },
});

export const readVersion = {
  function: readVersionFunction,
  definition: readVersionDefinition,
};
