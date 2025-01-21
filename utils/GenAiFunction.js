const { JsonOutputParser } = require('@langchain/core/output_parsers');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { model } = require('../config/genai.config');
const fs = require('fs');
const axios = require('axios');
const { getRecords, insertRecords } = require('./dbFunctions');
const { UUIDV4 } = require('sequelize');

const parser = new JsonOutputParser();

exports.generateGenAiTaskObject = async (project, projectTeam) => {
  let time = `${Date.now()}-${Math.floor(Math.random() * 900000) + 100000}`;
  console.time('Total Time' + `: ${time}`);

  try {
    // Log project and projectTeam for debugging
    console.log('Project Data:', project);
    console.log('Project Team Data:', projectTeam);

    if (!project || !projectTeam) {
      throw new Error('Project or ProjectTeam data is missing or invalid.');
    }

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'You are an AI assistant that helps to insert records in the database. You have to generate a JSON object based on the provided details for ${project} and ${projectTeam}. The task object is in JSON format. The fields of the task object should be populated based on the project and project team data, and if some fields are missing, you should fill them with AI-generated or default values. Only return the JSON object : {output}, nothing else.',
      ],
      [
        'user',
        [
          {
            type: 'text',
            text: 'Provide a JSON object containing the task data : {output} , where all the columns must be filled with the relevant information from the provided project and project team data. The following fields should be populated: billing company, project manager, assigned user, status, task details, and uuid auto generated using uuidv4 for fields which have mentioned in below list .',
          },
        ],
      ],
    ]);

    console.time('Pipeline Execution' + `: ${time}`);
    const chain = prompt.pipe(model).pipe(parser);
    const response = await chain.invoke({
      project: JSON.stringify(project),
      projectTeam: JSON.stringify(projectTeam),
      output: {
        task_user_taskboard_id: '',
        task_uuid: UUIDV4(),
        billing_company_uuid: '',
        billing_company_name: '',
        billing_company_branch_uuid: '',
        billing_company_branch_name: '',
        type: '',
        type_name: '',
        type_uuid: UUIDV4(),
        title: '',
        description: '',
        due_date: '',
        upload_file: '',
        priority: '',
        time_taken: '',
        category_name: '',
        category_uuid: '',
        project_manager: '',
        project_manager_uuid: '',
        assigned_to_name: '',
        assigned_to_uuid: '',
        status: '',
        created_by_uuid: '',
        modified_by_uuid: '',
        create_ts: '',
        insert_ts: '',
      },
    });
    console.timeEnd('Pipeline Execution' + `: ${time}`);

    if (!response || typeof response !== 'object') {
      throw new Error(
        'Invalid response: The response is either null or not an object.',
      );
    }
    console.log('Generated Task Object:', response);
    await insertRecords('tasks', response);
    console.timeEnd('Total Time' + `: ${time}`);
    return response;
  } catch (error) {
    console.error('Error generating task object:', error.message);
    throw error;
  }
};

// Example usage
(async () => {
  try {
    const project = await getRecords(
      'project',
      `where project_uuid='75a18482-082e-463a-b4a3-b43d032bcf04'`,
    );
    const projectTeam = await getRecords(
      'project_team',
      `where project_uuid='75a18482-082e-463a-b4a3-b43d032bcf04'`,
    );

    const result = await this.generateGenAiTaskObject(project, projectTeam);
    console.log('Final Task Object:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
