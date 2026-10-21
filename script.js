class Terminal {
    constructor() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('command-input');
        this.inputLine = this.output.querySelector('.input-line');
        // Snapshot the welcome banner so 'clear' can restore it exactly
        this.welcomeLines = Array.from(this.output.children)
            .filter(node => node !== this.inputLine)
            .map(node => node.cloneNode(true));
        this.commandHistory = [];
        this.historyIndex = 0;
        // Output lines waiting to be revealed by the typing animation
        this.pending = [];
        this.revealTimer = null;
        this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.setupEventListeners();
        this.setupCommands();
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            // Any key skips the typing animation
            this.flushOutput();

            if (e.key === 'Tab') {
                e.preventDefault();
                this.completeInput();
            } else if (e.key === 'Enter') {
                this.processCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            } else if (e.ctrlKey && e.key === 'c' && this.input.selectionStart === this.input.selectionEnd) {
                // Like a real shell: abandon the current line
                e.preventDefault();
                this.addCommandToOutput(this.input.value + '^C');
                this.input.value = '';
                this.historyIndex = this.commandHistory.length;
                this.scrollToBottom();
            }
        });

        // Keep input focused, but don't steal focus from a text selection
        document.addEventListener('click', () => {
            if (!window.getSelection().toString()) {
                this.input.focus();
            }
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
            echo: (args) => this.addOutput(args.join(' '), 'text'),
            theme: (args) => this.setTheme(args[0]),
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
        const prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.textContent = 'yiqiwang@io:~$';
        const text = document.createElement('span');
        text.className = 'command';
        text.textContent = command;
        line.append(prompt, text);
        // The echoed command shows instantly; only output is animated
        this.output.insertBefore(line, this.inputLine);
    }

    executeCommand(command) {
        const parts = command.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        // hasOwn guards against names like 'constructor' or '__proto__'
        if (Object.hasOwn(this.commands, cmd)) {
            this.commands[cmd](args);
        } else {
            this.addOutput(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
        }
    }

    addOutput(text, className = 'text') {
        // Drop trailing blank lines left by template literals
        const lines = text.replace(/\s+$/, '').split('\n');

        lines.forEach(lineText => {
            const line = document.createElement('div');
            line.className = 'line output';
            // Hanging indent: wrapped text lines up after a bullet or a "Label:   " column
            const indent = lineText.match(/^ *(• |[\w /]{1,20}: +)?/)[0].length;
            if (indent) {
                line.style.paddingLeft = `${indent}ch`;
                line.style.textIndent = `-${indent}ch`;
            }
            const span = document.createElement('span');
            span.className = className;
            // A non-breaking space keeps empty lines from collapsing
            this.appendLinkified(span, lineText || '\u00a0');
            line.appendChild(span);
            this.emit(line);
        });
    }

    // Queue a node for the line-by-line typing animation
    emit(node) {
        this.output.insertBefore(node, this.inputLine);
        if (this.reduceMotion) return;

        node.classList.add('pending');
        this.pending.push(node);
        if (!this.revealTimer) {
            this.revealTimer = setInterval(() => this.revealNext(), 18);
        }
    }

    revealNext() {
        const node = this.pending.shift();
        if (node) {
            node.classList.remove('pending');
            node.classList.add('appear');
            this.scrollToBottom();
        }
        if (this.pending.length === 0) {
            clearInterval(this.revealTimer);
            this.revealTimer = null;
        }
    }

    flushOutput() {
        if (this.pending.length === 0) return;
        this.pending.forEach(node => node.classList.remove('pending'));
        this.pending = [];
        clearInterval(this.revealTimer);
        this.revealTimer = null;
        this.scrollToBottom();
    }

    completeInput() {
        const value = this.input.value.replace(/^\s+/, '');
        const themeArg = value.match(/^theme\s+(\S*)$/i);
        const [prefix, candidates, base] = themeArg
            ? [themeArg[1], Object.keys(Terminal.themes), 'theme ']
            : [value, Object.keys(this.commands), ''];
        if (!themeArg && /\s/.test(value)) return;

        const matches = candidates.filter(name => name.startsWith(prefix.toLowerCase()));
        if (matches.length === 0) return;
        if (matches.length === 1) {
            this.input.value = base + matches[0];
            return;
        }

        // Extend to the longest common prefix; if that adds nothing, list the options like bash
        let common = matches[0];
        matches.forEach(m => {
            while (!m.startsWith(common)) common = common.slice(0, -1);
        });
        if (common.length > prefix.length) {
            this.input.value = base + common;
        } else {
            this.addCommandToOutput(this.input.value);
            this.addOutput(matches.join('  '), 'info');
            this.flushOutput();
        }
    }

    setTheme(name) {
        const current = document.documentElement.dataset.theme || 'monokai';
        if (!name) {
            const list = Object.entries(Terminal.themes)
                .map(([key, label]) => `    ${key === current ? '*' : ' '} ${key.padEnd(9)}${label}`)
                .join('\n');
            this.addOutput(`Available themes:\n\n${list}\n\nUsage: theme <name>`, 'info');
            return;
        }

        const key = name.toLowerCase();
        if (!Object.hasOwn(Terminal.themes, key)) {
            this.addOutput(`Unknown theme: ${name}. Type 'theme' to list themes.`, 'error');
            return;
        }
        document.documentElement.dataset.theme = key;
        try {
            localStorage.setItem('theme', key);
        } catch (e) {
            // Storage may be unavailable (private mode); the theme still applies for this visit
        }
        this.addOutput(`Theme set to ${key}.`, 'success');
    }

    // Turn emails and bare URLs (github.com/..., yiqiwang.io) into clickable links
    appendLinkified(parent, text) {
        const pattern = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+|(?:https?:\/\/)?(?:[\w-]+\.)+(?:com|io|org|net)(?:\/[^\s]*)?/g;
        let last = 0;
        for (const match of text.matchAll(pattern)) {
            const target = match[0].replace(/[.,;:)]+$/, '');
            parent.append(text.slice(last, match.index));
            const link = document.createElement('a');
            link.textContent = target;
            if (target.includes('@') && !target.includes('/')) {
                link.href = `mailto:${target}`;
            } else {
                link.href = /^https?:\/\//.test(target) ? target : `https://${target}`;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
            parent.append(link);
            last = match.index + target.length;
        }
        parent.append(text.slice(last));
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
    echo [text]  - Print text
    theme [name] - List or switch color themes

Use arrow keys to navigate command history, Tab to autocomplete.`, 'info');
    }

    showAbout() {
        this.addOutput(`YIQI WANG
Senior Software Engineer

Passionate Full-Stack Developer | Machine Learning | Tech Enthusiast

Professional Summary:
    Experienced Senior Software Engineer with a strong background in .NET development, modern web technologies, and system design. Skilled in building scalable backend services and interactive front-end interfaces. Proven expertise in asynchronous programming with C#, SignalR for real-time communication, and performance-optimized SQL development. Adept at integrating third-party APIs, including payment gateways like Stripe and PayPal, and implementing secure file upload systems with chunked transfer and encryption. Familiar with RabbitMQ for messaging, Redis for caching, and DevOps pipelines for streamlined deployment. Strong interest in machine learning applications, and experienced in building AI-assisted content transformation systems. Collaborative and pragmatic, with a user-focused mindset and an ability to balance business needs with technical execution.

    Current Focus:
    • Breaking a payment monolith into microservices
    • Payment channel integration and PCI compliance
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
        const projects = [
            {
                name: 'Smart Reading and Learning Companion',
                description: 'An AI-powered dual-mode content transformation system that turns complex articles into kid-friendly or language-learning formats.',
                tech: ['.NET', 'SignalR', 'DeepSeek'],
                status: 'Completed'
            },
            {
                name: 'Synchronized Multi-Client Video Playback',
                description: 'A real-time multi-client video viewer where all participants see synchronized playback across machines. Server-side stress testing with 200+ clients.',
                tech: ['HTML5 Video', 'Bootstrap', 'SignalR'],
                status: 'Completed'
            },
            {
                name: 'Kinex Japanese Used Car Sales System',
                description: 'A web-based system for Japanese used car sales, with features for managing inventory, customer interactions, and sales processes.',
                tech: ['ASP.NET Core', 'Entity Framework', 'PostgreSQL', 'RabbitMQ'],
                status: 'Completed'
            },
            {
                name: 'Lumi Glass Sales Management System',
                description: 'A sales management system for Lumi Glass, focusing on inventory management, order processing, and customer relationship management.',
                tech: ['.NET 9', 'PostgreSQL', 'RabbitMQ', 'Redis'],
                status: 'Completed'
            },
            {
                name: 'ILoveTata Pet Park Management System',
                description: 'A single Go binary serving a staff admin console, a WeChat member H5 app, and a 92-endpoint REST API, with WeChat OAuth and WeChat Pay V3 callbacks. Built to run several sites on one 2-core / 2GB VPS.',
                tech: ['Go', 'chi', 'huma', 'sqlc', 'PostgreSQL', 'Vue 3', 'TypeScript', 'Tailwind'],
                status: 'Active'
            },
            {
                name: 'Live Device Monitoring Console (Film Prop)',
                description: 'An on-screen prop for a film production: a real-time style console monitoring network, host, display, and mobile devices, with configurable devices and simulated live data.',
                tech: ['HTML', 'CSS', 'Vanilla JavaScript'],
                status: 'Completed'
            }
        ];

        this.addOutput('Projects Directory:\n', 'text');
        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'project-item';

            const header = document.createElement('div');
            header.className = 'project-title';
            const name = document.createElement('span');
            name.textContent = project.name;
            const status = document.createElement('span');
            status.className = `project-status ${project.status === 'Completed' ? 'done' : 'active'}`;
            status.textContent = project.status;
            header.append(name, status);

            const description = document.createElement('div');
            description.className = 'project-description';
            description.textContent = project.description;

            const tech = document.createElement('div');
            tech.className = 'project-tech';
            project.tech.forEach(t => {
                const tag = document.createElement('span');
                tag.textContent = t;
                tech.appendChild(tag);
            });

            item.append(header, description, tech);
            this.emit(item);
        });
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
    Languages:  C#, Go, JavaScript, TypeScript, Python, SQL
    Frameworks: .NET, ASP.NET Core, SignalR, Entity Framework, React, Vue, Node.js, Express
    Databases:  SQL Server, PostgreSQL, MongoDB, Redis
    Messaging:  RabbitMQ
    Payments:   Stripe, PayPal, WeChat Pay, PCI compliance
    Monitoring: Prometheus, Grafana
    AI / LLM:   DeepSeek
    Tools:      Git, Docker, Jenkins, Azure DevOps
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
    • Leading the ongoing transition from a monolithic architecture to a microservices-based structure, modularizing services based on business logic for efficient inter-service communication.
    • Conducted in-depth analysis of the payment system’s bottlenecks and shortcomings, identifying issues like payment latency, error handling, and data consistency. Collaborated with the team to develop solutions, redesigning and implementing core payment processes and data synchronization mechanisms, which improved system reliability and performance, and significantly enhanced the user experience.
    • Planned and executed a large-scale migration of user payment data, ensuring data integrity and accuracy throughout the process. Designed a phased migration strategy to minimize impact on the production environment and implemented exception-handling mechanisms.
    • Implemented key performance indicators and metrics for the payment system, such as success rate, response time, and error rate, creating real-time monitoring dashboards in Prometheus and Grafana. Configured automatic alerting mechanisms to notify relevant teams of abnormal fluctuations or threshold breaches in critical metrics, enabling rapid issue identification and response, which significantly improved system stability and incident management.
    • Integrating PayPal as a new payment channel alongside the existing payment providers.
    • Driving PCI compliance work for the payment platform.
    • Led the integration of multiple third-party payment APIs, including key functions like payment authorization, settlement, and refunds. Ensured API compliance and optimized data transmission and response times.
    • As a senior developer, provided guidance to junior developers, offering one-on-one technical training, code reviews, and regular knowledge-sharing sessions. Helped junior team members quickly advance their technical skills, ensuring their code quality met team standards.

Achievements:
    • First Place Overall in PressReader's Inaugural Internal Hackathon.

──────────────────────────────────────

Position:    Software Engineer
Company:     D3 Security Management 
Duration:    2022-06 - 2023-06

Key Responsibilities:
    • Played a crucial role as a key member of the project team responsible for upgrading the main products from .Net Framework 4.x to .Net 6.
    • Implemented various design patterns such as dependency injection, factory, and others to refactor over 70% of the project's codebase, resulting in improved operational efficiency of the system.
    • Successfully refactored essential components like TaskManager and Playbook, breaking down the previously tightly-coupled system services into multiple microservices. Additionally, rewrote the execution logic to ensure smooth functioning.
    • Developed an innovative IOC/IOA (indicators of compromise and indicators of attack) feature using MongoDb and Go.js, enabling the visualization of artifact relationships through interactive diagrams.
    • Restructured API endpoints to adhere to RESTful protocols, while implementing front-end and back-end separation and microservice architecture through the use of API Gateways and load balancers.
    • Overhauled the authentication and authorization system of the product, leveraging an independently created database operation library to seamlessly integrate with Microsoft's Identity middleware for a seamless system upgrade.
    • Revamped multiple system security libraries, enhancing system integrity and simplifying the development process for new developers.
    • Developed an independent open-source library tailored for ASP.Net API projects, specifically focusing on streamlining user input cleanup. This library significantly reduces back-end developers' workload and eliminates duplicate code.
    • Authored a comprehensive system framework upgrade handbook comprising nearly 100 pages. This resource provides guidance to developers at all levels, enabling them to quickly adapt to the code structure changes introduced in the new system framework.
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
        this.flushOutput();
        // Remove everything but the input line, then restore the welcome banner
        while (this.output.firstChild !== this.inputLine) {
            this.output.removeChild(this.output.firstChild);
        }
        this.welcomeLines.forEach(node => {
            this.output.insertBefore(node.cloneNode(true), this.inputLine);
        });
        this.input.focus();
    }

    scrollToBottom() {
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
}

Terminal.themes = {
    monokai: 'Monokai (default)',
    dracula: 'Dracula',
    light: 'One Light'
};

// Initialize terminal when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});
