
import { GoogleGenAI } from "@google/genai";
import { Contract, Customer } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder for development.
  // In a real environment, the API key would be securely managed.
  // console.warn("API_KEY environment variable not set. Using a placeholder.");
  // process.env.API_KEY = "YOUR_API_KEY_HERE";
}


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });


export const generateAMCReminderEmail = async (contract: Contract, customer: Customer): Promise<string> => {
  if (!process.env.API_KEY) {
    return Promise.resolve(`Subject: Regarding Your Upcoming Annual Maintenance Contract Renewal

Dear ${customer.name},

We hope this email finds you well.

This is a friendly reminder that your Annual Maintenance Contract (AMC) with us is due for renewal soon.

Here are the details of your previous contract:
- **Original Deal Amount:** $${contract.dealAmount.toLocaleString()}
- **Agreed AMC Amount:** $${contract.amcAmount.toLocaleString()}
- **Renewal Date:** ${new Date(contract.renewalDate).toLocaleDateString()}

Please let us know if you would like to proceed with the renewal. We value your business and look forward to continuing our partnership.

Best regards,

Your Service Team`);
  }

  const prompt = `
    Generate a professional and friendly reminder email to a client about their upcoming Annual Maintenance Contract (AMC) renewal.

    **Client Details:**
    - Company Name: ${customer.name}

    **Contract Details:**
    - Previous Deal Closed Amount: $${contract.dealAmount.toLocaleString()}
    - Agreed AMC Renewal Amount: $${contract.amcAmount.toLocaleString()}
    - Renewal Date: ${new Date(contract.renewalDate).toLocaleDateString()}

    **Instructions:**
    - The tone should be polite and professional.
    - Clearly state the purpose of the email.
    - Include the key contract details provided above.
    - End with a call to action, asking them to confirm the renewal.
    - Do not include placeholders like "[Your Company Name]". Assume the sender is "The Service Team".
    - The output should be only the email content (including a subject line), without any preamble or explanation. Start with "Subject: ...".
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating email with Gemini API:", error);
    // Fallback to a template if the API fails
    return `Subject: Regarding Your Upcoming Annual Maintenance Contract Renewal

Dear ${customer.name},

We hope this email finds you well.

This is a friendly reminder that your Annual Maintenance Contract (AMC) with us is due for renewal soon.

Here are the details of your previous contract:
- Original Deal Amount: $${contract.dealAmount.toLocaleString()}
- Agreed AMC Amount: $${contract.amcAmount.toLocaleString()}
- Renewal Date: ${new Date(contract.renewalDate).toLocaleDateString()}

Please let us know if you would like to proceed with the renewal. We value your business and look forward to continuing our partnership.

Best regards,

The Service Team`;
  }
};
