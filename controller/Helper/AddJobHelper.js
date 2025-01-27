const jobData = require("./JobDataStorage");

exports.handleAddJobFlow = async (from, text, sendMessage) => {
    const userJobData = jobData[from];

    switch (userJobData.step) {
        case 0:
            userJobData.title = text;
            userJobData.step++;
            await sendMessage({
                number: from,
                message: "Great! Now, choose an Industry Sector: 1. IT 2. Healthcare 3. Finance 4. Education"
            });
            break;
        case 1:
            userJobData.industry = parseIndustryOption(text);
            userJobData.step++;
            await sendMessage({
                number: from,
                message: "How many vacancies? 1. 1-20 2. 21-40 3. 41-60"
            });
            break;
        case 2:
            userJobData.vacancies = parseVacanciesOption(text);
            userJobData.step++;
            await sendMessage({
                number: from,
                message: "Please provide the Job Location."
            });
            break;
        case 3:
            userJobData.location = text;
            userJobData.step++;
            await sendMessage({
                number: from,
                message: "What's the mode of working? 1. Remote 2. On-site 3. Hybrid"
            });
            break;
        case 4:
            userJobData.mode = parseModeOption(text);
            userJobData.step++;
            await sendMessage({
                number: from,
                message: `Here's the job post summary:\n\nJob Title: ${userJobData.title}\nIndustry: ${userJobData.industry}\nVacancies: ${userJobData.vacancies}\nLocation: ${userJobData.location}\nMode of Working: ${userJobData.mode}\n\nType 'Confirm' to submit or 'Cancel' to discard.`
            });
            break;
        case 5:
            if (text.toLowerCase() === "confirm") {
                console.log("Job Data Submitted:", userJobData);
                delete jobData[from]; // Clear the user's data
                await sendMessage({
                    number: from,
                    message: "✅ Your job post has been submitted successfully!"
                });
            } else {
                delete jobData[from];
                await sendMessage({
                    number: from,
                    message: "❌ Job post creation canceled."
                });
            }
            break;
        default:
            await sendMessage({
                number: from,
                message: "An unexpected error occurred. Please restart the process with /addjob."
            });
            delete jobData[from];
    }
};

// Utility functions to parse user options
const parseIndustryOption = (text) => {
    const options = ["IT", "Healthcare", "Finance", "Education"];
    return options[parseInt(text) - 1] || "Unknown";
};

const parseVacanciesOption = (text) => {
    const options = ["1-20", "21-40", "41-60"];
    return options[parseInt(text) - 1] || "Unknown";
};

const parseModeOption = (text) => {
    const options = ["Remote", "On-site", "Hybrid"];
    return options[parseInt(text) - 1] || "Unknown";
};
