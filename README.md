# Taskboard

Migration Commands Readme
Introduction

This readme file provides instructions on how to use migration commands to manage database migrations using Node.js.
Prerequisites
mandatory

    Node.js installed on your system.
    Properly configured database connection details.

Installation

    Clone this repository to your local machine.
    Navigate to the project directory in your terminal.

Usage

# Migration of Tables:

node migration.js --migrate:tables

This command migrates database tables according to the defined schema.

# Migration of views: 

node migration.js --migrate:views

This command migrates views.

# Migration of Procedures:

node migration.js --migrate:procs

This command migrates stored procedures/functions to the database.

# Migration of Seeders:

node migration.js --migrate:seeders

This command executes seeders to populate the database with initial data.

Configuration

Before running the migration commands, ensure to configure the database connection details in the config.js file.

<!--
### Generate migration file under module folder .

```
node migration.js --generate:<table | alter | seeder>-{expectated file name} [create migration file]
```

### Run migrations.

```
node migration.js --migrate [migrate all files/folders]
or
node migration.js --migrate:<tables|alters|views|procs> [migrate given specific folder]
``` -->
