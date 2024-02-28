const shell = require('shelljs');
const { readFileContent, readDirectory } = require('./utils/helperFunction');
const { squilizeInit } = require('./utils/dbFunctions');
const colors = require('colors');

const arguments = process.argv.slice(2);
const errorMessage = () => {
  console.log('Invalid commands');
  console.log('Type node migration.js --help for possible commands');
};
if (!arguments.length) {
  errorMessage();
  shell.exit();
}

const returnFiles = async (path) => {
  try {
    return await readDirectory(path);
  } catch (e) {
    console.error(e);
    return [];
  }
};

const executeMigration = async (args) => {
  if (args.startsWith('--generate:')) {
    let command = args.split(':')[1];
    if (command) {
      if (command.startsWith('table-')) {
        let fileName = command.replace('table-', '');
        if (!fileName) {
          errorMessage();
          shell.exit();
        }
        shell.exec(
          `npx sequelize-cli migration:generate --name ${fileName} --migrations-path migrations/tables`,
        );
      } else if (command.startsWith('alter-')) {
        let fileName = command.replace('alter-', '');
        if (!fileName) {
          errorMessage();
          shell.exit();
        }
        shell.exec(
          `npx sequelize-cli migration:generate --name ${fileName} --migrations-path migrations/alters`,
        );
      } else if (command.startsWith('seeder-')) {
        let fileName = command.replace('seeder-', '');
        if (!fileName) {
          errorMessage();
          shell.exit();
        }
        shell.exec(
          `npx sequelize-cli migration:generate --name seeder-${fileName} --migrations-path migrations/seeders`,
        );
      } else errorMessage();
    } else {
      errorMessage();
    }
  } else if (args.startsWith('--migrate')) {
    let alertMsg = '================Updating ${dir}================'.yellow
      .bold;
    if (args.includes(':')) {
      args = args.split(':')[1];
    }
    if (args === 'tables' || args === '--migrate') {
      let dir = 'Table'; // use inside alertMsg
      console.log(eval('`' + alertMsg + '`'));
      shell.exec(
        `npx sequelize-cli db:migrate --migrations-path migrations/tables`,
      );
    }
    if (args === 'alters' || args === '--migrate') {
      let dir = 'Alters'; // use inside alertMsg
      console.log(eval('`' + alertMsg + '`'));
      shell.exec(
        `npx sequelize-cli db:migrate --migrations-path migrations/alters`,
      );
    }

    let directories =
      args === 'views'
        ? ['views']
        : args === 'procs'
          ? ['procs']
          : args === '--migrate'
            ? ['views', 'procs']
            : [];
    for (let dir of directories) {
      let files = await returnFiles('./migrations/' + dir);
      console.log(files.length ? eval('`' + alertMsg + '`') : '');
      for (let file of files) {
        let content = (
          await readFileContent('./migrations/' + dir, file)
        ).toLocaleString();
        // console.log(content);
        if (content) {
          try {
            let sequilize = squilizeInit();
            await sequilize.query(content);
            console.log('Complete'.green.bold, file);
          } catch (_) {
            console.log('Error'.red.bold, file);
          }
        }
      }
    }
    if (args === 'seeders' || args === '--migrate') {
      let dir = 'Seeders'; // use inside alertMsg
      console.log(eval('`' + alertMsg + '`'));
      shell.exec(
        `npx sequelize-cli db:migrate --migrations-path migrations/seeders`,
      );
    }
    shell.exit();
  } else if (args.startsWith('--help')) {
    console.log(`possible commands:
        1. node migration.js --generate:<table | alter | seeder>-{expectated file name} [create migration file]
        2. node migration.js --migrate [migrate all files/folders]
        3. node migration.js --migrate:<tables|alters|views|procs|seeders> [migrate given specific folder]
        `);
  } else {
    errorMessage();
  }
};
executeMigration(arguments[0]);
