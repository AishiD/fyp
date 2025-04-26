document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const fileUpload = document.getElementById('fileUpload');
    const fileInfo = document.getElementById('fileInfo');
    const translateBtn = document.getElementById('translateBtn');
    const uploadSection = document.getElementById('uploadSection');
    const translationResults = document.getElementById('translationResults');
    const downloadBtn = document.getElementById('downloadBtn');
    const navButtons = document.querySelectorAll('.nav-button');
    const uploadBox = document.querySelector('.upload-box');
    
    // Handle file upload
    fileUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (file) {
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
            }
        } else {
            fileInfo.textContent = '';
            translateBtn.disabled = true;
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
        // Show loading state
        translateBtn.textContent = 'Translating...';
        translateBtn.disabled = true;
        
        // Simulate translation process
        setTimeout(function() {
            // Hide upload section
            uploadSection.style.display = 'none';
            
            // Show translation results
            translationResults.style.display = 'flex';
            downloadBtn.style.display = 'block';
            
            // Reset translate button
            translateBtn.textContent = 'Translate';
            translateBtn.disabled = false;
        }, 2000); // 2-second delay to simulate translation
    });
    
    // Download button click
    downloadBtn.addEventListener('click', function() {
        // In a real application, this would generate and download the translations
        alert('Translations downloaded successfully!');
    });
    
    // Navigation buttons (back and forward)
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (translationResults.style.display === 'flex') {
                // Go back to upload view
                uploadSection.style.display = 'block';
                translationResults.style.display = 'none';
                downloadBtn.style.display = 'none';
                
                // Reset file upload
                fileUpload.value = '';
                fileInfo.textContent = '';
                translateBtn.disabled = true;
            }
        });
    });
    
    // Make upload box clickable
    uploadBox.addEventListener('click', function() {
        fileUpload.click();
    });
});