import emailjs from '@emailjs/browser';

/**
 * Ye function user ko email bhejega.
 * Humne ab ismein 'userName' bhi add kar diya hai taaki 
 * template mein {{user_name}} sahi se kaam kare.
 */
export const sendRedeemCodeEmail = async (userEmail, userName, code) => {
  const serviceId = 'service_pl2qe26'; 
  const templateId = 'template_vedsmll'; 
  const publicKey = '5oP8zgae_NJ2xC67B'; 

  const templateParams = {
    to_email: userEmail,      // Template mein {{to_email}} hona chahiye
    user_name: userName,      // Template mein {{user_name}} hona chahiye
    redeem_code: code,        // Template mein {{redeem_code}} hona chahiye
    message: "Aapka payment verify ho gaya hai. Enjoy your comic!"
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('✅ Email Sent Successfully!', response.status, response.text);
    return true;
  } catch (error) {
    console.error('❌ Email Failed...', error);
    return false;
  }
};