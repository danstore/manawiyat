document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const storyItems = document.querySelectorAll('#stories li');
    const storyTitle = document.getElementById('story-title');
    const homeLink = document.getElementById('home-link');
    const additionalSections = document.getElementById('additional-sections');
    const allStories = document.querySelectorAll('.story-data');
    const relatedContents = document.querySelectorAll('.related-data');
    const homepageContent = document.getElementById('homepage-content');

    // Display story function
    function displayStory(storyId) {
        // Hide all stories first
        allStories.forEach(story => story.style.display = 'none');
        relatedContents.forEach(content => content.style.display = 'none');
        homepageContent.style.display = 'none';
        
        // Show the selected story
        const selectedStory = document.getElementById(storyId);
        if (selectedStory) {
            selectedStory.style.display = 'block';
            // Update title in header
            const storyTitleElement = document.querySelector(`li[data-story="${storyId}"]`);
            if (storyTitleElement) {
                storyTitle.textContent = storyTitleElement.textContent;
            }
            
            // Show additional sections
            additionalSections.style.display = 'block';
        } else {
            storyTitle.textContent = 'حکایت یافت نشد';
            homepageContent.innerHTML = '<p>متاسفانه حکایت مورد نظر یافت نشد.</p>';
            homepageContent.style.display = 'block';
            additionalSections.style.display = 'none';
        }
    }

    // Reset to homepage
    function showHomepage() {
        // Hide all stories
        allStories.forEach(story => story.style.display = 'none');
        relatedContents.forEach(content => content.style.display = 'none');
        
        // Show homepage content
        homepageContent.style.display = 'block';
        storyTitle.textContent = '';
        additionalSections.style.display = 'none';
    }

    // Click event for story items
    storyItems.forEach(item => {
        item.addEventListener('click', function() {
            const storyId = this.getAttribute('data-story');
            displayStory(storyId);
        });
    });

    // Search functionality
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) return;

        // Store all matching stories
        const matchedStories = [];
        
        // Search through all story content
        document.querySelectorAll('.story-data').forEach(storyElement => {
            const storyId = storyElement.id;
            const storyContent = storyElement.textContent.toLowerCase();
            const storyTitle = document.querySelector(`li[data-story="${storyId}"]`).textContent.toLowerCase();
            
            // Check for exact match
            const exactMatch = storyContent.includes(searchTerm) || storyTitle.includes(searchTerm);
            
            // Check for similar matches (words in common)
            const searchWords = searchTerm.split(/\s+/);
            const similarMatch = searchWords.some(word => word.length > 2 && 
                (storyContent.includes(word) || storyTitle.includes(word)));
            
            if (exactMatch || similarMatch) {
                matchedStories.push({
                    id: storyId,
                    title: document.querySelector(`li[data-story="${storyId}"]`).textContent,
                    exact: exactMatch
                });
            }
        });

        if (matchedStories.length > 0) {
            // Sort results: exact matches first
            matchedStories.sort((a, b) => b.exact - a.exact);
            
            // If only one result or first is an exact match, show it directly
            if (matchedStories.length === 1 || matchedStories[0].exact) {
                displayStory(matchedStories[0].id);
            } else {
                // Show search results
                storyTitle.textContent = 'نتایج جستجو: ' + searchTerm;
                homepageContent.innerHTML = '<h3>نتایج جستجو</h3><ul class="search-results"></ul>';
                
                const resultsList = homepageContent.querySelector('.search-results');
                matchedStories.forEach(match => {
                    const resultItem = document.createElement('li');
                    resultItem.textContent = match.title;
                    resultItem.style.cursor = 'pointer';
                    resultItem.style.padding = '10px';
                    resultItem.style.borderBottom = '1px solid #eee';
                    if (match.exact) {
                        resultItem.style.fontWeight = 'bold';
                    }
                    
                    resultItem.addEventListener('click', () => displayStory(match.id));
                    resultsList.appendChild(resultItem);
                });
                
                homepageContent.style.display = 'block';
                allStories.forEach(story => story.style.display = 'none');
                relatedContents.forEach(content => content.style.display = 'none');
                additionalSections.style.display = 'none';
            }
        } else {
            storyTitle.textContent = 'جستجو: ' + searchTerm;
            allStories.forEach(story => story.style.display = 'none');
            relatedContents.forEach(content => content.style.display = 'none');
            homepageContent.style.display = 'block';
            homepageContent.innerHTML = '<p>نتیجه‌ای برای جستجوی شما یافت نشد.</p>';
            additionalSections.style.display = 'none';
        }
    });

    // Enter key for search
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    // Home link functionality
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        showHomepage();
        searchInput.value = '';
    });

    // Add explanation section interactivity
    const explanationLinks = document.querySelectorAll('.explanation-link');
    
    // Toggle explanation content when links are clicked
    explanationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            
            // Hide all explanation contents first
            document.querySelectorAll('.explanation-content').forEach(content => {
                if (content.id) {
                    content.style.display = 'none';
                }
            });
            
            // Show the selected content
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });
    
    // Dynamic explanation button management
    setupDynamicExplanations();
    
    // Initialize the page
    showHomepage();

    // Add email link animation (optional)
    const emailLink = document.getElementById('email-link');
    if (emailLink) {
        emailLink.addEventListener('mouseover', function() {
            this.style.textDecoration = 'underline';
        });
        emailLink.addEventListener('mouseout', function() {
            this.style.textDecoration = 'none';
        });
    }

    // Like button functionality
    const likeBtn = document.getElementById('like-button');
    const likeCount = document.getElementById('like-count');
    let likes = 0;

    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            likes++;
            likeCount.textContent = likes;
            this.classList.add('liked');
            setTimeout(() => {
                this.classList.remove('liked');
            }, 300);
        });
    }

    // Comment form submission
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');

    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nameInput = document.getElementById('commenter-name');
            const emailInput = document.getElementById('commenter-email');
            const commentInput = document.getElementById('comment-text');

            if (nameInput.value && commentInput.value) {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <h4>${nameInput.value}</h4>
                    <p>${commentInput.value}</p>
                `;

                commentsList.innerHTML = '';
                commentsList.appendChild(commentElement);

                // Clear form
                nameInput.value = '';
                emailInput.value = '';
                commentInput.value = '';
            }
        });
    }

    // Social share buttons
    const socialBtns = document.querySelectorAll('.social-btn');

    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            let shareUrl = '';
            const pageUrl = encodeURIComponent(window.location.href);
            const pageTitle = encodeURIComponent(document.title);

            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                    break;
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`;
                    break;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // Check viewport size and adjust layout if needed
    function checkResponsive() {
        const isMobile = window.innerWidth <= 768;
        const sidebar = document.getElementById('sidebar');
        
        if (isMobile) {
            // Add collapsible behavior for mobile if needed
            if (!sidebar.classList.contains('mobile-ready')) {
                sidebar.classList.add('mobile-ready');
                
                // Create a toggle button for sidebar on mobile
                const toggleBtn = document.createElement('button');
                toggleBtn.id = 'sidebar-toggle';
                toggleBtn.textContent = 'فهرست داستان‌ها';
                toggleBtn.style.display = 'block';
                toggleBtn.style.width = '100%';
                toggleBtn.style.padding = '10px';
                toggleBtn.style.marginBottom = '10px';
                toggleBtn.style.backgroundColor = '#3a6ea5';
                toggleBtn.style.color = 'white';
                toggleBtn.style.border = 'none';
                toggleBtn.style.borderRadius = '4px';
                toggleBtn.style.cursor = 'pointer';
                toggleBtn.style.fontSize = '1rem';
                
                const searchContainer = document.getElementById('search-container');
                sidebar.insertBefore(toggleBtn, searchContainer);
                
                // Initially hide the sidebar content on mobile
                const sidebarContent = document.querySelectorAll('#sidebar > *:not(#sidebar-toggle)');
                sidebarContent.forEach(el => el.style.display = 'none');
                
                // Toggle sidebar content when button is clicked
                toggleBtn.addEventListener('click', function() {
                    sidebarContent.forEach(el => {
                        el.style.display = el.style.display === 'none' ? 'block' : 'none';
                    });
                });
            }
        } else {
            // Reset for desktop view
            if (sidebar.classList.contains('mobile-ready')) {
                const toggleBtn = document.getElementById('sidebar-toggle');
                if (toggleBtn) toggleBtn.remove();
                
                const sidebarContent = document.querySelectorAll('#sidebar > *');
                sidebarContent.forEach(el => el.style.display = 'block');
                
                sidebar.classList.remove('mobile-ready');
            }
        }
    }
    
    // Run on page load
    checkResponsive();
    
    // Run when window is resized
    window.addEventListener('resize', checkResponsive);

    // Function to setup dynamic explanation content management
    function setupDynamicExplanations() {
        // Add event listeners to existing buttons
        document.querySelectorAll('.explanation-button').forEach(button => {
            button.addEventListener('click', toggleExplanationContent);
        });
        
        // Add functionality for adding new entries
        document.querySelectorAll('.add-explanation-button').forEach(button => {
            button.addEventListener('click', function() {
                // Check for password first
                const password = prompt("لطفا رمز عبور را وارد کنید:");
                if (password === "623569") {
                    const container = this.closest('.explanation-content');
                    createNewExplanationItem(container);
                } else {
                    alert("رمز عبور اشتباه است!");
                }
            });
        });
        
        // Add functionality for adding new categories
        const addCategoryBtn = document.getElementById('add-category');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', function() {
                // Check for password first
                const password = prompt("لطفا رمز عبور را وارد کنید:");
                if (password === "623569") {
                    createNewCategory();
                } else {
                    alert("رمز عبور اشتباه است!");
                }
            });
        }
        
        // Make editable content work
        document.querySelectorAll('.editable-title, .editable-content').forEach(element => {
            element.setAttribute('contenteditable', 'true');
        });
    }
    
    function createNewCategory() {
        const template = document.getElementById('new-category-template');
        const newCategory = template.cloneNode(true);
        newCategory.id = 'category-' + Date.now();
        newCategory.style.display = 'block';
        
        const categoryLink = newCategory.querySelector('.explanation-link');
        categoryLink.textContent = 'دسته جدید';
        categoryLink.setAttribute('data-target', newCategory.id + '-content');
        categoryLink.setAttribute('contenteditable', 'true');
        
        const categoryContent = newCategory.querySelector('.explanation-content');
        categoryContent.id = newCategory.id + '-content';
        
        const addButton = categoryContent.querySelector('.add-explanation-button');
        addButton.addEventListener('click', function() {
            createNewExplanationItem(categoryContent);
        });
        
        categoryLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hide all explanation contents first
            document.querySelectorAll('.explanation-content').forEach(content => {
                if (content.id) {
                    content.style.display = 'none';
                }
            });
            
            // Show this category's content
            categoryContent.style.display = 'block';
        });
        
        const explanationLinks = document.getElementById('explanation-links');
        explanationLinks.insertBefore(newCategory, document.getElementById('add-category').parentNode);
    }
    
    function toggleExplanationContent() {
        const content = this.nextElementSibling;
        if (content) {
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        }
    }
    
    function createNewExplanationItem(container) {
        // Create button
        const newButton = document.createElement('button');
        newButton.className = 'explanation-button';
        newButton.contentEditable = true;
        newButton.textContent = 'عنوان مورد جدید';
        newButton.style.backgroundColor = '#18c7d4';
        newButton.style.fontWeight = 'bold';
        newButton.addEventListener('click', toggleExplanationContent);
        newButton.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                // Remove this item if title is empty
                const contentDiv = this.nextElementSibling;
                if (contentDiv) contentDiv.remove();
                this.remove();
            }
        });
        
        // Create content div
        const contentDiv = document.createElement('div');
        contentDiv.className = 'explanation-content';
        
        // Create poem line
        const poemLine = document.createElement('div');
        poemLine.className = 'poem-line';
        poemLine.contentEditable = true;
        poemLine.textContent = 'متن شعر را اینجا وارد کنید';
        
        // Create poem analysis
        const poemAnalysis = document.createElement('div');
        poemAnalysis.className = 'poem-analysis';
        poemAnalysis.contentEditable = true;
        poemAnalysis.textContent = 'تفسیر شعر را اینجا وارد کنید';
        
        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'حذف این مورد';
        deleteButton.style.backgroundColor = '#ff4444';
        deleteButton.style.color = 'white';
        deleteButton.style.padding = '5px 10px';
        deleteButton.style.border = 'none';
        deleteButton.style.borderRadius = '4px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.marginTop = '10px';
        deleteButton.style.fontSize = '0.8rem';
        
        deleteButton.addEventListener('click', function() {
            newButton.remove();
            contentDiv.remove();
        });
        
        // Assemble the content div
        contentDiv.appendChild(poemLine);
        contentDiv.appendChild(poemAnalysis);
        contentDiv.appendChild(deleteButton);
        
        // Insert new elements before the "Add New Item" button
        const addButton = container.querySelector('.add-explanation-button');
        container.insertBefore(newButton, addButton);
        container.insertBefore(contentDiv, addButton);
    }
});