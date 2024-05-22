#!/bin/bash
# Run npm install
npm install
# Restart your PM2-managed process
pm2 restart all
