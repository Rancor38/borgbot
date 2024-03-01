/*
 * Function: manageFile
 * ---------------------
 * This function performs file management operations such as writing to a file, checking if a file exists,
 * and deleting a file based on the specified action. The function supports three actions: "write", "look", and "delete".
 *
 * Parameters:
 * - action: A string representing the action to perform. It can be one of the following:
 *   - "write": Write content to a file.
 *   - "look": Check if a file exists.
 *   - "delete": Delete a file.
 * - destination: A string representing the path to the file.
 * - content (optional): A string representing the data to write to the file (only required for "write" action).
 * - callback (optional): A function to call after the operation is completed successfully.
 *                        The callback function receives parameters based on the action:
 *                        - For "look" action, it receives a boolean indicating whether the file exists.
 *                        - For "write" and "delete" actions, it does not receive any parameters.
 *
 * Throws:
 * - Error: If an invalid action is specified.
 * - Error: If content is not provided for the "write" action.
 *
 * Example usage:
 * manageFile("write", "./data/override.txt", "true", () => {
 *     // Callback function executed after writing to the file
 * });
 *
 * manageFile("look", "./data/override.txt", null, (exists) => {
 *     console.log(`File exists: ${exists}`);
 * });
 *
 * manageFile("delete", "./data/override.txt", null, () => {
 *     console.log("File deleted successfully");
 * });
 */



const fs = require('fs');

function manageFile(action, destination, content, callback = () => {}) {
    if (action === "write") {
        if (!content) {
            throw new Error("Content must be provided for 'write' action.");
        }
        fs.writeFile(destination, content, (err) => {
            if (err) {
                throw err;
            } else {
                callback();
            }
        });
    } else if (action === "look") {
        fs.access(destination, fs.constants.F_OK, (err) => {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    } else if (action === "delete") {
        fs.unlink(destination, (err) => {
            if (err) {
                throw err;
            } else {
                callback();
            }
        });
    } else {
        throw new Error("Invalid action specified.");
    }
}

module.exports = {manageFile}