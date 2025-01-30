const Candidate_Module = require("../../models/WhatsappBusiness/Candidate");
const { userDatas, jobDatas } = require("./ResponseDataStorage");

const handleAddUserFlow = async (text, from, sendMessage) => {
    const userData = userDatas[from];  

    switch (userData.step) {
        case 0:
            userData.firstName = text;
            userData.step++;
            await sendMessage({
                number: from,
                message: "Great! Now, please share your *Last Name*.",
            });
            break;

        case 1:
            userData.lastName = text;
            userData.step++;
            await sendMessage({
                number: from,
                message: "Thanks! Please select your *Gender*:",
                buttons: [
                    { id: "gender_male", title: "Male" },
                    { id: "gender_female", title: "Female" },
                    { id: "gender_nonbinary", title: "Non-Binary" },
                ],
            });
            break;

        case 2:
            userData.gender = text;
            userData.step++;
            await sendMessage({
                number: from,
                message: "Got it! Now, share your *Personal Mobile Number*.",
            });
            break;

        case 3:
            userData.mobile = text;
            userData.step++;
            await sendMessage({
                number: from,
                message: "Thanks! Please share your *Office Email Address*.",
            });
            break;

        case 4:
            userData.email = text;
            userData.step++;
            await sendMessage({
                number: from,
                message: "Almost there! Please share your *Birth Date* (YYYY-MM-DD).",
            });
            break;

        case 5:
            userData.birthDate = text;
            userData.step++;
            await sendMessage({
                number: from,
                message: `Here's the Details:\n\nFirst Name: ${userData.firstName}\nLast Name: ${userData.lastName}\nGender: ${userData.gender}\nMobile: ${userData.mobile}\nEmail: ${userData.email}\n\nType 'Confirm' to submit or 'Cancel' to discard.`
                
            });
            break;
        case 6:
            if (text.toLowerCase() === "confirm") {
                const newCandidate = new Candidate_Module({
                    firstName: userData?.firstName,
                    lastName: userData?.lastName,
                    gender: userData?.gender,
                    mobile: userData?.mobile,
                    email: userData?.email,
                    birthDate: userData?.birthDate,
                    share_id: userData?.share_id                   
                })
                try {
                    await newCandidate.save();
                    console.log("newCandidate Saved:", userData);
                    delete userDatas[from]; 
                    await sendMessage({
                        number: from,
                        message: "🎉 You're all set! Welcome to Meepl, and thank you for completing the onboarding process."
                    });
                } catch (error) {
                    console.error("error_newCandidate Saved:",error.message)
                }
                
            } else {
                delete userDatas[from];
                await sendMessage({
                    number: from,
                    message: "❌ Candidate Onboarding canceled."
                });
            }
            break;            
        default:
            await sendMessage({
                number: from,
                message: "An unexpected error occurred. Please restart the process /meepl onboarding G@R",
            });
            delete userDatas[from];
    }
};


const handleAddJobFlow = async (from, text, sendMessage) => {
    const userJobData = jobDatas[from];

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
                console.log("new Job Saved:", userJobData);
                delete jobDatas[from];
                await sendMessage({
                    number: from,
                    message: "✅ Your job post has been submitted successfully!"
                });
            } else {
                delete jobDatas[from];
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
            delete jobDatas[from];
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


module.exports = {
    handleAddUserFlow,
    handleAddJobFlow
}

