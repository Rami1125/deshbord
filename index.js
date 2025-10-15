async function saveOrderAndNotify(orderData) {
            /********************************************************************************
             * *
             * !!! חשוב מאוד !!!                                                            *
             * כדי לכתוב מידע ל-Google Sheet ולשלוח התראות OneSignal בצורה מאובטחת,       *
             * יש להשתמש בשרת צד-שלישי. אסור לחשוף מפתחות API לכתיבה בקוד של האפליקציה.    *
             * הדרך המומלצת היא ליצור Web App פשוט באמצעות Google Apps Script.             *
             * *
             * הקוד הבא הוא דוגמה לאיך היית "קורא" לשרת כזה מהאפליקציה שלך.               *
             * *
             ********************************************************************************/
            
            const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbyQxFTsUt1OjT9NY7oj0Pva94yP-kXNKoVJiSCTIVRLguRlZeUZuPpsBb9g-abQlqO0JA/exec'; // <-- יש להחליף בכתובת של ה-Web App שלך
            
            console.log('Sending order to backend:', orderData);
            
            // This part is a simulation. You need to implement the backend logic.
            // In a real scenario, you would uncomment the fetch call below.
            try {
                
                await fetch(BACKEND_URL, {
                    method: 'POST',
                    // headers: { 'Content-Type': 'application/json' }, // Not needed for no-cors with GAS
                    body: JSON.stringify(orderData),
                    mode: 'no-cors' // Required for simple Apps Script POST requests
                });
                
                // Note: with 'no-cors', you can't read the response status, 
                // but the request is sent. You can handle success/error inside the Apps Script.
                console.log('Request sent to backend.');
                
                
                // For demonstration, we'll just simulate a successful response
                // console.log("סימולציה: הבקשה נשלחה לשרת בהצלחה.");
                return true; 

            } catch (error) {
                console.error('Failed to send order to backend:', error);
                return false;
            }
        }
```הבנתי, אח יקר. אתה רוצה להרחיב את היכולות של דף הניהול, כך שתוכל גם להוסיף הזמנות לאורך היום וגם, בסוף היום, לשתף בווטסאפ סיכום מרוכז של **כל ההזמנות העתידיות** שנוצרו, לא רק אלו של מחר.

זה רעיון מצוין שמשדרג את כל תהליך העבודה.

טיפלתי בזה עבורך וביצעתי את השינויים הבאים בקובץ `index.html`:

1.  **הוספת הזמנות:** היכולת להוסיף הזמנות חדשות מדף הניהול כבר קיימת ופעילה. תוכל להמשיך להשתמש בטופס הקיים כדי להוסיף הזמנות לכל תאריך שתרצה.
2.  **שדרוג כפתור השיתוף:** שיניתי את הכרטיסייה "דוח למחר" ל-"**שתף הזמנות עתידיות**". הכפתור החדש יאסוף אוטומטית **כל הזמנה** שהתאריך שלה הוא אחרי היום, יסדר את הרשימה לפי נהגים ויכין לך הודעת ווטסאפ מעוצבת ומוכנה לשליחה.

הנה הקובץ המעודכן עם כל היכולות החדשות. פשוט טען אותו ל-Canvas והכל יהיה מוכן לעבודה.

