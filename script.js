class Terminal {
    constructor() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('command-input');
        this.commandHistory = [];
        this.historyIndex = 0;
        this.setupEventListeners();
        this.setupCommands();
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.processCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            }
        });

        // Keep input focused
        document.addEventListener('click', () => {
            this.input.focus();
        });
    }

    setupCommands() {
        this.commands = {
            help: () => this.showHelp(),
            clear: () => this.clearTerminal(),
            me: () => this.showAbout(),
            ls: () => this.showProjects(),
            whoami: () => this.addOutput('yiqiwang', 'success'),
            date: () => this.addOutput(new Date().toString(), 'text'),
            pwd: () => this.addOutput('/home/yiqiwang', 'text'),
            contact: () => this.showContact(),
            skills: () => this.showSkills(),
            education: () => this.showEducation(),
            experience: () => this.showExperience()
        };
    }

    processCommand() {
        const command = this.input.value.trim();
        if (command) {
            this.addCommandToOutput(command);
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length;
            this.executeCommand(command);
        }
        this.input.value = '';
        this.scrollToBottom();
    }

    addCommandToOutput(command) {
        const line = document.createElement('div');
        line.className = 'line';
        line.innerHTML = `<span class="prompt">yiqiwang@io:~$</span><span class="command">${command}</span>`;
        const inputLine = document.querySelector('.input-line');
        // Insert before the input line
        this.output.insertBefore(line, inputLine);
    }

    executeCommand(command) {
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (this.commands[cmd]) {
            this.commands[cmd](args);
        } else {
            this.addOutput(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
        }
    }

    addOutput(text, className = 'text') {
        // Split text by newlines and process each line
        const lines = text.split('\n');
        const inputLine = document.querySelector('.input-line');
        
        lines.forEach(lineText => {
            const line = document.createElement('div');
            line.className = 'line';
            // Handle empty lines - check if line is completely empty (not just whitespace)
            if (lineText === '') {
                line.innerHTML = `<span class="${className}">&nbsp;</span>`;
            } else {
                // Preserve leading spaces by replacing them with non-breaking spaces
                const preservedSpaces = lineText.replace(/^ +/, match => '&nbsp;'.repeat(match.length));
                line.innerHTML = `<span class="${className}">${preservedSpaces}</span>`;
            }
            // Insert before the input line
            this.output.insertBefore(line, inputLine);
        });
    }

    // Convenience method for adding empty lines
    addEmptyLine() {
        this.addOutput('', 'text');
    }

    addOutputHTML(html) {
        const line = document.createElement('div');
        line.className = 'line';
        line.innerHTML = html;
        const inputLine = document.querySelector('.input-line');
        // Insert before the input line
        this.output.insertBefore(line, inputLine);
    }

    showHelp() {
        this.addOutput(`Available commands:

    help         - Show this help message
    me           - Display personal information
    ls           - List all projects
    contact      - Show contact information
    skills       - Display technical skills
    education    - Show educational background
    experience   - Display work experience
    clear        - Clear the terminal
    whoami       - Display current user
    date         - Show current date and time
    pwd          - Show current directory

Use arrow keys to navigate command history.`, 'info');
    }

    showAbout() {
        this.addOutput(`YIQI WANG
Senior Software Engineer

Passionate Full-Stack Developer | Machine Learning | Tech Enthusiast

Professional Summary:
    Experienced Senior Software Engineer with a strong background in .NET development,
    modern web technologies, and system design. Skilled in building scalable backend
    services and interactive front-end interfaces. Proven expertise in asynchronous 
    programming with C#, SignalR for real-time communication, and performance-optimized 
    SQL development. Adept at integrating third-party APIs, including payment gateways 
    like Stripe, and implementing secure file upload systems with chunked transfer and 
    encryption. Familiar with RabbitMQ for messaging, Redis for caching, and DevOps 
    pipelines for streamlined deployment. Strong interest in machine learning 
    applications, and experienced in building AI-assisted content transformation systems. 
    Collaborative and pragmatic, with a user-focused mindset and an ability to balance 
    business needs with technical execution.

    Current Focus:
    • Building scalable web applications
    • Exploring cloud technologies and DevOps
    • Contributing to open-source projects
    • Continuous learning and skill development

Philosophy:
    "Code is cheap, show your prompt."

Location: Canada
    • Vancouver, British Columbia
GitHub:   github.com/kylinwang2018`, 'text');
    }

    showProjects() {
        this.addOutput(`Projects Directory:

┌─ Smart Reading and Learning Companion
│  An AI-powered dual-mode content transformation system that turns complex articles 
│      into kid-friendly or language-learning formats.
│  Tech: NET, SignalR, DeepSeek
└  Status: Under Development

┌─ Synchronized Multi-Client Video Playback
│  A real-time multi-client video viewer where all participants see synchronized 
│      playback across machines. Server-side stress testing with 200+ clients.
│  Tech: HTML5 Video, Bootstrap, SignalR.
└  Status: Completed

┌─ Kinex Japanese Used Car Sales System
│  A web-based system for Japanese used car sales, with features for managing
│      inventory, customer interactions, and sales processes.
│  Tech: ASP.NET Core, Entity Framework, PostgreSQL, RabbitMQ
└  Status: Completed

┌─ Lumi Glass Sales Management System
│  A sales management system for Lumi Glass, focusing on inventory management,
│      order processing, and customer relationship management.
│  Tech: .NET 9, PostgreSQL, RabbitMQ, Redis
└  Status: Completed`, 'text');
    }

    showContact() {
        this.addOutput(`Contact Information:

Email:       benwang.developer@gmail.com
LinkedIn:    linkedin.com/in/yiqi-wang-ben/
GitHub:      github.com/kylinwang2018
Website:     yiqiwang.io

Feel free to reach out for:
    • Collaboration opportunities
    • Technical discussions
    • Project inquiries
    • Open source contributions`, 'text');
    }

    showSkills() {
        this.addOutput(`Technical Skills:
    Languages:  C#, JavaScript, TypeScript, Python, SQL
    Frameworks: .NET, React, Node.js, Express
    Databases: SQL Server, MongoDB, PostgreSQL
    Tools:     Git, Docker, Jenkins, Azure DevOps
`, 'text');
    }

    showEducation() {
        this.addOutput(`Education:

University: The University of Melbourne
Location:   Melbourne, Australia
Degree:     Master of Information Technology
Major:      Machine Learning

Relevant Coursework:
    • Advanced Algorithms
    • Data Structures
    • Machine Learning
    • Web Development
    • Database Systems

Academic Achievements:
    • Paper: Identifying lameness in horses through deep learning
        dl.acm.org/doi/10.1145/3412841.3441973
    `, 'text');
    }

    showExperience() {
        this.addOutput(`Professional Experience:

Position:    Senior Software Engineer
Company:     PressReader
Duration:    2023-06 - Present

Key Responsibilities:
    • Led the transition from a monolithic architecture to a microservices-based 
        structure, modularizing services based on business logic for efficient 
        inter-service communication.
    • Conducted in-depth analysis of the payment system’s bottlenecks and 
        shortcomings, identifying issues like payment latency, error handling, and 
        data consistency. Collaborated with the team to develop solutions, 
        redesigning and implementing core payment processes and data synchronization 
        mechanisms, which improved system reliability and performance, and 
        significantly enhanced the user experience.
    • Planned and executed a large-scale migration of user payment data, ensuring 
        data integrity and accuracy throughout the process. Designed a phased 
        migration strategy to minimize impact on the production environment and 
        implemented exception-handling mechanisms.
    • Implemented key performance indicators and metrics for the payment system, 
        such as success rate, response time, and error rate, creating real-time 
        monitoring dashboards in Prometheus and Grafana. Configured automatic 
        alerting mechanisms to notify relevant teams of abnormal fluctuations or 
        threshold breaches in critical metrics, enabling rapid issue identification 
        and response, which significantly improved system stability and incident 
        management.
    • Led the integration of multiple third-party payment APIs, including key 
    functions like payment authorization, settlement, and refunds. Ensured API 
    compliance and optimized data transmission and response times.
    • As a senior developer, provided guidance to junior developers, offering 
    one-on-one technical training, code reviews, and regular knowledge-sharing sessions. 
    Helped junior team members quickly advance their technical skills, ensuring their 
    code quality met team standards.

Achievements:
    • First Place Overall in PressReader's Inaugural Internal Hackathon.

──────────────────────────────────────

Position:    Software Engineer
Company:     D3 Security Management 
Duration:    2022-06 - 2023-06

Key Responsibilities:
    • Played a crucial role as a key member of the project team responsible for 
        upgrading the main products from .Net Framework 4.x to .Net 6.
    • Implemented various design patterns such as dependency injection, factory, 
        and others to refactor over 70% of the project's codebase, resulting in 
        improved operational efficiency of the system.
    • Successfully refactored essential components like TaskManager and Playbook, 
        breaking down the previously tightly-coupled system services into multiple 
        microservices. Additionally, rewrote the execution logic to ensure smooth 
        functioning.
    • Developed an innovative IOC/IOA (indicators of compromise and indicators of 
        attack) feature using MongoDb and Go.js, enabling the visualization of 
        artifact relationships through interactive diagrams.
    • Restructured API endpoints to adhere to RESTful protocols, while implementing 
        front-end and back-end separation and microservice architecture through the 
        use of API Gateways and load balancers.
    • Overhauled the authentication and authorization system of the product, leveraging 
        an independently created database operation library to seamlessly integrate 
        with Microsoft's Identity middleware for a seamless system upgrade.
    • Revamped multiple system security libraries, enhancing system integrity and 
        simplifying the development process for new developers.
    • Developed an independent open-source library tailored for ASP.Net API projects, 
        specifically focusing on streamlining user input cleanup. This library 
        significantly reduces back-end developers' workload and eliminates duplicate 
        code.
    • Authored a comprehensive system framework upgrade handbook comprising nearly 
        100 pages. This resource provides guidance to developers at all levels, 
        enabling them to quickly adapt to the code structure changes introduced in 
        the new system framework.
`, 'text');
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }

        this.input.value = this.commandHistory[this.historyIndex] || '';
    }

    clearTerminal() {
        this.output.innerHTML = `
            <div class="line">
                <span class="prompt">yiqiwang@io:~$</span>
                <span class="command">Welcome to Yiqi Wang's Terminal Portfolio</span>
            </div>
            <div class="line">
                <span class="text">Type 'help' to see available commands.</span>
            </div>
            <div class="line"></div>
            <div class="input-line">
                <span class="prompt">yiqiwang@io:~$</span>
                <input type="text" id="command-input" autocomplete="off" autofocus>
            </div>
        `;
        // Re-setup the input reference and event listeners
        this.input = document.getElementById('command-input');
        this.setupEventListeners();
        // Ensure the input is focused
        this.input.focus();
    }

    scrollToBottom() {
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
}

// Initialize terminal when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});

// Easter eggs and additional functionality
document.addEventListener('keydown', (e) => {
    // Konami code or other easter eggs can be added here
    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        const terminal = document.querySelector('.terminal');
        terminal.style.animation = 'none';
        setTimeout(() => {
            terminal.style.animation = '';
        }, 100);
    }
});
