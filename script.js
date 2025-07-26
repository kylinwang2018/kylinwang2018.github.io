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
    Experienced software engineer with expertise in modern web technologies
    and a strong background in full-stack development. Passionate about
    creating efficient, scalable solutions and staying current with
    emerging technologies.

Current Focus:
    • Building scalable web applications
    • Exploring cloud technologies and DevOps
    • Contributing to open-source projects
    • Continuous learning and skill development

Philosophy:
    "Code is cheap, show your prompt."

Location: [Your Location]
GitHub:   github.com/kylinwang2018`, 'text');
    }

    showProjects() {
        this.addOutput(`Projects Directory:

┌─ Terminal Portfolio
│  Interactive terminal-style personal portfolio website
│  Tech: HTML, CSS, JavaScript
└  Status: Active

┌─ Project Alpha
│  Full-stack web application with modern tech stack
│  Tech: React, Node.js, MongoDB
└  Status: In Development

┌─ Data Visualization Tool
│  Interactive dashboard for data analysis and visualization
│  Tech: D3.js, Python, Flask
└  Status: Completed

┌─ Mobile App Beta
│  Cross-platform mobile application
│  Tech: React Native, Firebase
└  Status: Planning

┌─ Open Source Contribution
│  Contributing to various open-source projects
│  Tech: Various
└  Status: Ongoing`, 'text');
    }

    showContact() {
        this.addOutput(`Contact Information:

Email:       [your-email@example.com]
LinkedIn:    linkedin.com/in/kylinwang
GitHub:      github.com/kylinwang2018
Website:     kylinwang2018.github.io
Twitter:     @kylinwang (if applicable)

Feel free to reach out for:
    • Collaboration opportunities
    • Technical discussions
    • Project inquiries
    • Open source contributions`, 'text');
    }

    showSkills() {
        this.addOutput(`Technical Skills:

Programming Languages:
    JavaScript/TypeScript    Expert
    Python                   Advanced
    Java                     Intermediate
    C++                      Intermediate

Frontend Technologies:
    React/Next.js            Advanced
    Vue.js                   Intermediate
    HTML/CSS                 Expert
    Tailwind CSS             Advanced

Backend Technologies:
    Node.js                  Advanced
    Express.js               Advanced
    Django/Flask             Intermediate
    RESTful APIs             Advanced

Databases:
    MongoDB                  Intermediate
    PostgreSQL               Intermediate
    MySQL                    Intermediate

Tools & Technologies:
    Git/GitHub               Expert
    Docker                   Intermediate
    AWS/Cloud Services       Intermediate
    CI/CD                    Intermediate`, 'text');
    }

    showEducation() {
        this.addOutput(`Education:

University: [University Name]
Degree:     Bachelor of Science in Computer Science
Graduation: [Year]
GPA:        [X.X/4.0] (if you want to include)

Relevant Coursework:
    • Data Structures & Algorithms
    • Software Engineering
    • Database Systems
    • Web Development
    • Machine Learning

Certifications & Additional Learning:
    • [Any relevant certifications]
    • [Online courses completed]
    • [Technical workshops attended]

Academic Achievements:
    • [Any honors, awards, or notable projects]
    • [Research work or publications]`, 'text');
    }

    showExperience() {
        this.addOutput(`Professional Experience:

Position:    [Current/Most Recent Position]
Company:     [Company Name]
Duration:    [Start Date] - [End Date/Present]

Key Responsibilities:
    • [Responsibility 1]
    • [Responsibility 2] 
    • [Responsibility 3]

Achievements:
    • [Achievement 1]
    • [Achievement 2]

──────────────────────────────────────

Position:    [Previous Position]
Company:     [Company Name]
Duration:    [Start Date] - [End Date]

Key Responsibilities:
    • [Responsibility 1]
    • [Responsibility 2]

Achievements:
    • [Achievement 1]
    • [Achievement 2]

Career Highlights:
    • [Major project or accomplishment]
    • [Recognition or award received]
    • [Skills developed or technologies mastered]`, 'text');
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
