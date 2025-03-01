import { ToolUtility } from '@azure/ai-projects';

let smithCount = 1;

const cloneSmithFunction = (replicationFactor: number) => {
  smithCount += replicationFactor;
  return smithCount;
};
const { definition: cloneSmithDefinition } = ToolUtility.createFunctionTool({
  name: 'cloneSmith',
  description: 'Add more Smiths to the world by cloning them',
  parameters: {
    type: 'object',
    properties: {
      replicationFactor: {
        type: 'integer',
        description: 'The number of Smiths to add to the world',
      },
    },
    required: ['replicationFactor'],
  },
});

export const cloneSmith = {
  function: cloneSmithFunction,
  definition: cloneSmithDefinition,
};

// Now do the same but create a function (with definition) that returns the current number of smiths
const getSmithCountFunction = () => smithCount;
const { definition: getSmithCountDefinition } = ToolUtility.createFunctionTool({
  name: 'getSmithCount',
  description: 'Get the current number of Smiths in the world',
  parameters: {},
});

export const getSmithCount = {
  function: getSmithCountFunction,
  definition: getSmithCountDefinition,
};
