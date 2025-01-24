const { JsonOutputParser } = require('@langchain/core/output_parsers');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { model } = require('../config/genai.config');
const fs = require('fs');
const axios = require('axios');
const { getRecords, insertRecords } = require('./dbFunctions');
const { UUIDV4 } = require('sequelize');

const parser = new JsonOutputParser();

exports.generateGenAiTaskObject = async (
  userPrompt,
  project,
  projectTeam,
  output,
) => {
  let time = `${Date.now()}-${Math.floor(Math.random() * 900000) + 100000}`;
  console.time('Total Time' + `: ${time}`);

  try {
    console.log('Project Data:', project);
    console.log('Project Team Data:', projectTeam);

    // Now using correct references and formatting userPrompt directly
    const aiPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `
        You are an AI assistant that generates task records for a database in JSON format. Analyze the provided project and project team context, and generate a single JSON object representing a task.

        Rules:
        1. Check if the user mentioned in the input prompt is part of the project team:
          - If the user is not in the project team, return an empty JSON object 
          - Do not give empty json object , if not necessary.
          - If the user is in the project team, generate the JSON task object based on the following:
        2. Populate the task fields using:
          - Project context for details such as billing_company_uuid, project_manager, etc.
          - User input for task title, description, priority, and due date.
        3. Mandatory fields: Ensure all fields in the JSON task object are included, even if some values are empty.
        4. **If a field value cannot be determined, remove that field from the output JSON object.**
        5. Output format: Only return the JSON object in the specified structure, without any additional comments or explanations.
        `,
      ],
      [
        'user',
        [
          {
            type: 'text',
            text: `input prompt : {userPrompt}, project: {project}, projectTeam: {projectTeam}, output: {output}`,
          },
        ],
      ],
    ]);

    const chain = aiPrompt.pipe(model).pipe(parser);
    console.log('User Prompt:', userPrompt);
    const response = await chain.invoke({
      userPrompt: JSON.stringify(userPrompt),
      project: JSON.stringify(project),
      projectTeam: JSON.stringify(projectTeam),
      output: JSON.stringify(output),
    });
    console.timeEnd('Pipeline Execution' + `: ${time}`);
    console.log('response', response);
    if (!response || typeof response !== 'object') {
      throw new Error(
        'Invalid response: The response is either null or not an object.',
      );
    }
    console.log('Generated Task Object:', response);
    return response;
  } catch (error) {
    console.error('Error generating task object:', error.message);
    throw error;
  }
};
