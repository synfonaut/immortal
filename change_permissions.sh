#!/bin/bash

# Find PHP files that aren't 644
find public -type f -name "*.php" -not -path "*/.git*" -and -not -perm 644 | while read file; do
    echo chmod 644 "$file";
    chmod 644 "$file";
done

# Find directories that aren't 755 and in git
find public -type d -not -path "*/.git*" -and -not -perm 755 | while read file; do
    echo chmod 755 "$file";
    chmod 755 "$file";
done
