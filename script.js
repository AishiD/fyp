// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const fileUpload = document.getElementById('fileUpload');
    const fileInfo = document.getElementById('fileInfo');
    const translateBtn = document.getElementById('translateBtn');
    const uploadSection = document.getElementById('uploadSection');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const translationResults = document.getElementById('translationResults');
    const bengaliText = document.getElementById('bengaliText');
    const hindiText = document.getElementById('hindiText');
    const downloadBtn = document.getElementById('downloadBtn');
    const navButtons = document.querySelectorAll('.nav-button');
    const uploadBox = document.querySelector('.upload-box');

    // Store the uploaded file and extracted text
    let currentFile = null;
    let extractedText = '';
    let translatedText = '';
    
    // Translation API endpoint
    const API_ENDPOINT = 'https://api.yourtranslationservice.com/translate';
    // Replace with your actual API endpoint
    
    // Handle file upload
    fileUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (file) {
            // Store the current file
            currentFile = file;
            
            // Validate file types (PDF, JPG, JPEG, PNG)
            const fileType = file.type;
            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            
            if (validTypes.includes(fileType)) {
                // Display file info
                fileInfo.textContent = `Selected file: ${file.name} (${formatFileSize(file.size)})`;
                
                // Enable translate button
                translateBtn.disabled = false;
            } else {
                fileInfo.textContent = 'Invalid file type. Please upload a PDF or image file.';
                translateBtn.disabled = true;
                fileUpload.value = '';
                currentFile = null;
            }
        } else {
            fileInfo.textContent = '';
            translateBtn.disabled = true;
            currentFile = null;
        }
    });
    
    // Format file size
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' bytes';
        } else if (bytes < 1048576) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else {
            return (bytes / 1048576).toFixed(1) + ' MB';
        }
    }
    
    // Translate button click
    translateBtn.addEventListener('click', function() {
        if (!currentFile) return;
        
        // Show loading spinner
        uploadSection.style.display = 'none';
        loadingSpinner.style.display = 'flex';
        
        if (currentFile.type === 'application/pdf') {
            // Process PDF file
            processPdfFile(currentFile);
        } else {
            // For images, use OCR processing
            processImageFile(currentFile);
        }
    });
    
    // Process PDF file to extract text
    function processPdfFile(file) {
        const fileReader = new FileReader();
        
        fileReader.onload = function() {
            const typedArray = new Uint8Array(this.result);
            
            // Load the PDF file
            pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
                let textContent = '';
                
                // Function to extract text from each page
                function getPageText(pageNum) {
                    return pdf.getPage(pageNum).then(function(page) {
                        return page.getTextContent().then(function(content) {
                            // Join all text items
                            const strings = content.items.map(function(item) {
                                return item.str;
                            });
                            return strings.join(' ');
                        });
                    });
                }
                
                // Get text from all pages
                const pagePromises = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    pagePromises.push(getPageText(i));
                }
                
                Promise.all(pagePromises).then(function(pageTexts) {
                    // Combine text from all pages
                    extractedText = pageTexts.join('\n\n');
                    
                    // Display Bengali text and translate to Hindi
                    displayAndTranslate(extractedText);
                });
            }).catch(function(error) {
                console.error('Error loading PDF:', error);
                showErrorMessage('Failed to process PDF file. Please try again.');
            });
        };
        
        fileReader.readAsArrayBuffer(file);
    }
    
    // Process image file using OCR (mock implementation)
    function processImageFile(file) {
        // Create FormData to send image to OCR service
        const formData = new FormData();
        formData.append('image', file);
        
        // In a real application, you would send this to an OCR service
        // For demo purposes, we'll simulate the OCR response
        setTimeout(function() {
            // Simulated Bengali text from OCR
            const sampleBengaliText = `
                বাংলা সাহিত্য (Bengali literature) বাঙালি জাতির সাহিত্যচর্চার ফসল। এর
                ইতিহাস প্রায় এক হাজার বছরের পুরনো। বাংলা ভাষায় লিখিত সাহিত্যকে বাংলা
                সাহিত্য বলে। প্রাচীন বাংলা থেকে আধুনিক বাংলা ভাষার বিবর্তনের সঙ্গে সঙ্গে এর
                সাহিত্যেরও বিবর্তন ঘটেছে। বাংলা সাহিত্যের ইতিহাসকে সাধারণত প্রাচীন যুগ,
                মধ্যযুগ ও আধুনিক যুগ - এই তিন ভাগে ভাগ করা হয়।`;
                
            extractedText = sampleBengaliText;
            displayAndTranslate(extractedText);
        }, 2000);
        
        /* 
        // Real OCR implementation would look like this:
        fetch('https://api.ocr-service.com/extract', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            extractedText = data.text;
            displayAndTranslate(extractedText);
        })
        .catch(error => {
            console.error('OCR Error:', error);
            showErrorMessage('Failed to extract text from image. Please try again.');
        });
        */
    }
    
    // Display Bengali text and translate to Hindi using the HuggingFace model API
    function displayAndTranslate(bengaliContent) {
        // Display Bengali text
        bengaliText.innerHTML = formatTextWithParagraphs(bengaliContent);
        
        // Prepare the translation request
        const translationRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: bengaliContent,
                model: "arunapriyad24/MT",  // Use the specified HuggingFace model
                options: { wait_for_model: true }
            })
        };
        
        // Call the translation API
        // In a real implementation, you would use Hugging Face Inference API or a custom backend
        // that implements the transformer pipeline
        
        // For demonstration, we'll simulate the API call
        setTimeout(() => {
            // Simulated translation result
            const hindiTranslation = `
                बंगाली साहित्य (Bengali literature) बंगाली राष्ट्र के साहित्यिक प्रयासों का फल है। 
                इसका इतिहास लगभग एक हजार वर्ष पुराना है। बंगाली भाषा में लिखित साहित्य को 
                बंगाली साहित्य कहा जाता है। प्राचीन बंगाली से आधुनिक बंगाली भाषा के विकास के 
                साथ-साथ इसके साहित्य का भी विकास हुआ है। बंगाली साहित्य के इतिहास को 
                आमतौर पर प्राचीन युग, मध्य युग और आधुनिक युग - इन तीन भागों में विभाजित 
                किया जाता है।`;
                
            translatedText = hindiTranslation;
            hindiText.innerHTML = formatTextWithParagraphs(hindiTranslation);
            
            // Hide loading spinner and show results
            loadingSpinner.style.display = 'none';
            translationResults.style.display = 'flex';
            downloadBtn.style.display = 'block';
        }, 2000);
        
        
        // Real API implementation would look like this:
        fetch('https://api.huggingface.co/models/arunapriyad24/MT', translationRequest)
            .then(response => response.json())
            .then(data => {
                translatedText = data[0].generated_text;
                hindiText.innerHTML = formatTextWithParagraphs(translatedText);
                
                // Hide loading spinner and show results
                loadingSpinner.style.display = 'none';
                translationResults.style.display = 'flex';
                downloadBtn.style.display = 'block';
            })
            .catch(error => {
                console.error('Translation Error:', error);
                showErrorMessage('Failed to translate text. Please try again.');
            });
        
    }
    
    // Format text with proper paragraphs
    function formatTextWithParagraphs(text) {
        return text.split('\n\n')
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph.length > 0)
            .map(paragraph => `<p>${paragraph}</p>`)
            .join('');
    }
    
    // Show error message
    function showErrorMessage(message) {
        loadingSpinner.style.display = 'none';
        uploadSection.style.display = 'block';
        fileInfo.textContent = message;
        fileInfo.style.color = 'red';
    }
    
    // Download button click - Generate and download a PDF with translations
    downloadBtn.addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        
        // Create new PDF document
        const doc = new jsPDF();
        
        // Set font size and add title
        doc.setFontSize(16);
        doc.text('LitTranslate - Translation Results', 20, 20);
        
        // Add Bengali section
        doc.setFontSize(14);
        doc.text('Bengali (Original):', 20, 30);
        doc.setFontSize(12);
        
        // Add the Bengali text (wrapped to fit page width)
        const bengaliLines = doc.splitTextToSize(sanitizeTextForPdf(bengaliText.textContent), 170);
        doc.text(bengaliLines, 20, 40);
        
        // Add Hindi section (positioned after Bengali text)
        const bengaliHeight = bengaliLines.length * 7; // Approximation for text height
        doc.setFontSize(14);
        doc.text('Hindi (Translation):', 20, 50 + bengaliHeight);
        doc.setFontSize(12);
        
        // Add the Hindi text (wrapped to fit page width)
        const hindiLines = doc.splitTextToSize(sanitizeTextForPdf(hindiText.textContent), 170);
        doc.text(hindiLines, 20, 60 + bengaliHeight);
        
        // Add generation timestamp
        const timestamp = new Date().toLocaleString();
        doc.setFontSize(10);
        doc.text(`Generated by LitTranslate: ${timestamp}`, 20, 280);
        
        // Download the PDF
        doc.save('LitTranslate-Translation.pdf');
    });
    
    // Sanitize text for PDF generation (remove extra whitespace, etc.)
    function sanitizeTextForPdf(text) {
        return text.replace(/\s+/g, ' ').trim();
    }
    
    // Navigation buttons (back and forward)
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (translationResults.style.display === 'flex' || loadingSpinner.style.display === 'flex') {
                // Go back to upload view
                uploadSection.style.display = 'block';
                translationResults.style.display = 'none';
                loadingSpinner.style.display = 'none';
                downloadBtn.style.display = 'none';
                
                // Reset file upload
                fileUpload.value = '';
                fileInfo.textContent = '';
                fileInfo.style.color = '#555';
                translateBtn.disabled = true;
                currentFile = null;
                extractedText = '';
                translatedText = '';
            }
        });
    });
    
    // Make upload box clickable
    uploadBox.addEventListener('click', function() {
        fileUpload.click();
    });
});