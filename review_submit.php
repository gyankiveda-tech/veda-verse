<?php
// PHP स्क्रिप्ट शुरू होती है

// सुनिश्चित करें कि फॉर्म POST मेथड से सबमिट हुआ है
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. फॉर्म से डेटा सुरक्षित रूप से प्राप्त करें (Sanitize and Fetch Data)
    // 'username', 'rating', 'review' फॉर्म फ़ील्ड्स के नाम हैं
    $username = htmlspecialchars($_POST['username']);
    $rating = htmlspecialchars($_POST['rating']);
    $review = htmlspecialchars($_POST['review']);
    
    // 2. डेटा को व्यवस्थित करें (Format the Data)
    $timestamp = date("Y-m-d H:i:s");
    $data_line = "[$timestamp] | Rater: $username | Rating: $rating/5 Stars | Review: $review\n";
    
    // 3. डेटा को लोकल टेक्स्ट फ़ाइल में सेव करें (Save Data to File)
    // 'a' मोड का मतलब है कि यह डेटा को फ़ाइल के अंत में जोड़ देगा
    $file_path = 'reviews.txt';
    $file_success = file_put_contents($file_path, $data_line, FILE_APPEND | LOCK_EX);
    
    // 4. यूज़र को कन्फर्मेशन दें (User Confirmation)
    if ($file_success !== false) {
        // यदि सेव सफल हो, तो यूज़र को धन्यवाद पेज पर रीडायरेक्ट करें
        echo "<!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Transmission Success</title>
            <link href='https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap' rel='stylesheet'>
            <style>
                body { background-color: #0d001a; color: #00FFFF; font-family: 'Orbitron', sans-serif; text-align: center; padding-top: 50px; }
                .console { max-width: 600px; margin: 0 auto; padding: 40px; border: 3px solid #FF00FF; box-shadow: 0 0 20px #00FFFF; }
                h1 { color: #FF00FF; border-bottom: 2px solid #00FFFF; padding-bottom: 10px; }
                p { font-size: 1.1em; }
                a { color: #00FFFF; text-decoration: none; font-weight: bold; }
                a:hover { color: #E0FFFF; }
            </style>
        </head>
        <body>
            <div class='console'>
                <h1>[ DATA TRANSMISSION SUCCESSFUL ]</h1>
                <p>Status: ARCHIVED. Researcher **$username**, your Anomaly Report has been successfully logged into the VEDA Server Core.</p>
                <p>Thank you for contributing to the timeline integrity.</p>
                <p><a href='index.html'>:: RETURN TO DIGITAL PORTAL ::</a></p>
            </div>
        </body>
        </html>";
    } else {
        // यदि सेव असफल हो (उदाहरण के लिए फ़ोल्डर पर राइट परमिशन नहीं है)
        echo "<!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Transmission Failed</title>
            </head>
        <body>
            <div class='console'>
                <h1>[ DATA TRANSMISSION FAILED ]</h1>
                <p>Status: ERROR. Could not log report. Check server permissions.</p>
                <p><a href='index.html'>:: RETURN TO DIGITAL PORTAL ::</a></p>
            </div>
        </body>
        </html>";
    }

} else {
    // यदि कोई सीधे इस PHP पेज पर आता है
    header("Location: index.html");
    exit();
}
// PHP स्क्रिप्ट समाप्त होती है
?>