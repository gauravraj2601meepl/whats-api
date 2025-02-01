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
                message: "Great! Now, please share your *Last Name*:",
            });
            break;

        case 1:
            userData.lastName = text;
            userData.step++;
            await sendMessage({
                number: from,
                message: "Thanks! Please select your *Gender*:",
            });
            break;

        case 2:
            userData.gender = text;
            userData.step++;
            await sendMessage({
                number: from,
                message: "Got it! Now, share your *Personal Mobile Number*:",
            });
            break;

        case 3:
            const numericRegex = /^\d+$/;
            if (!numericRegex.test(text)) {
                await sendMessage({
                    number: from,
                    message: "❌ Invalid mobile number. Please enter a number containing only digits.",
                });
                return; 
            }
            userData.mobile = text;
            userData.step++;
            await sendMessage({
                number: from,
                message: "Thanks! Please share your *Office Email Address*:",
            });
            break;

        case 4:
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(text)) {
                await sendMessage({
                    number: from,
                    message: "❌ Invalid email format. Please enter a valid *Office Email Address*."
                })
                return;
            } 
            userData.email = text;
            userData.step++;
            await sendMessage({
                number: from,
                message: "Almost there! Please share your *Birth Date* (YYYY-MM-DD):",
            });
            break;

        case 5:
            const trimmedText = text.trim();
            // Date format validation (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(trimmedText)) {
                await sendMessage({
                    number: from,
                    message: "❌ Invalid date format. Please enter your *Birth Date* in the format YYYY-MM-DD.",
                });
                return;
            }
             // Additional check for valid date (e.g., month between 1-12, day between 1-31)
             const [year, month, day] = trimmedText.split('-');
             const date = new Date(trimmedText);
             if (
                 date.getFullYear() !== parseInt(year) ||
                 date.getMonth() + 1 !== parseInt(month) ||
                 date.getDate() !== parseInt(day)
             ) {
                 await sendMessage({
                     number: from,
                     message: "❌ Invalid date. Please enter a valid *Birth Date* in the format YYYY-MM-DD or leave it blank.",
                 });
                 return; 
             }
            userData.birthDate = trimmedText;
            userData.step++;
            await sendMessage({
                number: from,
                message: `Here's the Details:\n\nFirst Name: ${userData.firstName}\nLast Name: ${userData.lastName || "Not provided"}\nGender: ${userData.gender || "Not provided"}\nMobile: ${userData.mobile || "Not provided"}\nEmail: ${userData.email}\nBirth Date: ${userData.birthDate || "Not provided"}\n\nType 'Confirm' to submit or 'Cancel' to discard.`     
            });
            break;
        case 6:
            if (text.toLowerCase() === "confirm") {
                const {step,...filteredUserData} = userData;
                const newCandidate = new Candidate_Module({
                    firstName: userData?.firstName,
                    lastName: userData?.lastName,
                    gender: userData?.gender,
                    mobile: userData?.mobile,
                    email: userData?.email,
                    birthDate: userData?.birthDate,
                    share_id: userData?.share_id,
                    workspace: userData?.workspace,
                    userData: JSON.stringify(filteredUserData)                 
                })
                try {
                    await newCandidate.save();
                    console.log("newCandidate Saved:", userData, "json",JSON.stringify(filteredUserData));
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
                message: `An unexpected error occurred. Please restart the process /meepl onboarding ${userData?.share_id}`,
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

