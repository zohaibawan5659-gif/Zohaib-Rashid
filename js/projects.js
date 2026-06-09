// Dynamic Projects Rendering Logic
document.addEventListener('DOMContentLoaded', () => {
    
    // Expandable Data Structure
    const projectsData = [
        {
            title: "Enterprise Workflow Automation",
            description: "Streamlined business operations for international clients. Architecture details strictly confidential.",
            tags: ["Power Automate", "SharePoint", "VBA"],
            imageClass: "gradient-1",
            url: "projects/project-template/index.html"
        },
        {
            title: "Data Visualization Dashboard",
            description: "Developed an interactive business intelligence dashboard to visualize key performance indicators.",
            tags: ["Power BI", "Python", "SQL"],
            imageClass: "gradient-2",
            url: "projects/project-template/index.html"
        },
        {
            title: "Algorithmic Pathfinding Tool",
            description: "Built a custom routing optimization engine implementing BFS and DFS logic to minimize delivery times.",
            tags: ["Python", "Algorithms"],
            imageClass: "gradient-3",
            url: "projects/project-template/index.html"
        }
    ];

    const projectsContainer = document.getElementById('dynamic-projects-grid');
    if (!projectsContainer) return;

    projectsData.forEach((project, index) => {
        // Creating the anchor wrapper to fulfill the requirement
        const anchor = document.createElement('a');
        anchor.href = project.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.style.display = "block"; // Important for grid layout
        anchor.style.textDecoration = "none";
        anchor.style.color = "inherit";
        
        // Add animation delay based on index
        const delayClass = index === 0 ? '' : `delay-${index}`;

        anchor.innerHTML = `
            <div class="project-card glass-card scroll-reveal ${delayClass}">
                <div class="project-image">
                    <div class="image-placeholder ${project.imageClass}"></div>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        projectsContainer.appendChild(anchor);
    });
    
    // Re-initialize intersection observer for new dynamically added cards
    const newRevealElements = projectsContainer.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { rootMargin: "0px 0px -50px 0px" });

    newRevealElements.forEach(el => observer.observe(el));
});
