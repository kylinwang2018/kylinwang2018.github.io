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
            whoami: () => this.addOutput('kylinwang', 'success'),
            date: () => this.addOutput(new Date().toString(), 'text'),
            pwd: () => this.addOutput('/home/kylinwang', 'text'),
            echo: (args) => this.addOutput(args.join(' '), 'text'),
            cat: (args) => this.catCommand(args),
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
        line.innerHTML = `<span class="prompt">kylinwang@io:~$</span><span class="command">${command}</span>`;
        this.output.appendChild(line);
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
        const line = document.createElement('div');
        line.className = 'line';
        line.innerHTML = `<span class="${className}">${text}</span>`;
        this.output.appendChild(line);
    }

    addOutputHTML(html) {
        const line = document.createElement('div');
        line.className = 'line';
        line.innerHTML = html;
        this.output.appendChild(line);
    }

    showHelp() {
        this.addOutput('Available commands:', 'info');
        this.addOutput('', 'text');
        this.addOutput('  help         - Show this help message', 'text');
        this.addOutput('  me           - Display personal information', 'text');
        this.addOutput('  ls           - List all projects', 'text');
        this.addOutput('  contact      - Show contact information', 'text');
        this.addOutput('  skills       - Display technical skills', 'text');
        this.addOutput('  education    - Show educational background', 'text');
        this.addOutput('  experience   - Display work experience', 'text');
        this.addOutput('  clear        - Clear the terminal', 'text');
        this.addOutput('  whoami       - Display current user', 'text');
        this.addOutput('  date         - Show current date and time', 'text');
        this.addOutput('  pwd          - Show current directory', 'text');
        this.addOutput('  echo [text]  - Display text', 'text');
        this.addOutput('  cat [file]   - Display file contents', 'text');
        this.addOutput('', 'text');
        this.addOutput('Use arrow keys to navigate command history.', 'info');
    }

    showAbout() {
        const aboutText = `
┌─────────────────────────────────────────────────────────────┐
│                      YIQI WANG                              │
│                 Senior Software Engineer                    │
└─────────────────────────────────────────────────────────────┘

🚀 Passionate Full-Stack Developer | Machine Learning | Tech Enthusiast

💼 Professional Summary:
   Experienced software engineer with expertise in modern web technologies
   and a strong background in full-stack development. Passionate about
   creating efficient, scalable solutions and staying current with
   emerging technologies.

🎯 Current Focus:
   • Building scalable web applications
   • Exploring cloud technologies and DevOps
   • Contributing to open-source projects
   • Continuous learning and skill development

💡 Philosophy:
   "Code is cheap, show your prompt."

📍 Location: [Your Location]
🌐 GitHub: github.com/kylinwang2018
        `;
        this.addOutput(aboutText, 'success');
    }

    showProjects() {
        this.addOutput('📁 Projects Directory:', 'info');
        this.addOutput('', 'text');
        
        const projects = [
            {
                name: 'Terminal Portfolio',
                description: 'Interactive terminal-style personal portfolio website',
                tech: 'HTML, CSS, JavaScript',
                status: 'Active'
            },
            {
                name: 'Project Alpha',
                description: 'Full-stack web application with modern tech stack',
                tech: 'React, Node.js, MongoDB',
                status: 'In Development'
            },
            {
                name: 'Data Visualization Tool',
                description: 'Interactive dashboard for data analysis and visualization',
                tech: 'D3.js, Python, Flask',
                status: 'Completed'
            },
            {
                name: 'Mobile App Beta',
                description: 'Cross-platform mobile application',
                tech: 'React Native, Firebase',
                status: 'Planning'
            },
            {
                name: 'Open Source Contribution',
                description: 'Contributing to various open-source projects',
                tech: 'Various',
                status: 'Ongoing'
            }
        ];

        projects.forEach(project => {
            this.addOutputHTML(`
                <div class="project-item">
                    <div class="project-title">📦 ${project.name}</div>
                    <div class="project-description">   ${project.description}</div>
                    <div class="project-tech">   Tech: ${project.tech}</div>
                    <div class="project-tech">   Status: ${project.status}</div>
                </div>
            `);
        });
    }

    showContact() {
        const contactText = `
📞 Contact Information:
──────────────────────────────────────────

📧 Email:     [your-email@example.com]
💼 LinkedIn:  linkedin.com/in/kylinwang
🐙 GitHub:    github.com/kylinwang2018
🌐 Website:   kylinwang2018.github.io
📱 Twitter:   @kylinwang (if applicable)

💬 Feel free to reach out for:
   • Collaboration opportunities
   • Technical discussions
   • Project inquiries
   • Open source contributions
        `;
        this.addOutput(contactText, 'info');
    }

    showSkills() {
        const skillsText = `
🛠️  Technical Skills:
──────────────────────────────────────────

Programming Languages:
  ▶ JavaScript/TypeScript  ████████████ Expert
  ▶ Python                ███████████  Advanced
  ▶ Java                  ████████     Intermediate
  ▶ C++                   ███████      Intermediate

Frontend Technologies:
  ▶ React/Next.js         ███████████  Advanced
  ▶ Vue.js                ████████     Intermediate
  ▶ HTML/CSS              ████████████ Expert
  ▶ Tailwind CSS          ███████████  Advanced

Backend Technologies:
  ▶ Node.js               ███████████  Advanced
  ▶ Express.js            ███████████  Advanced
  ▶ Django/Flask          ████████     Intermediate
  ▶ RESTful APIs          ███████████  Advanced

Databases:
  ▶ MongoDB               ████████     Intermediate
  ▶ PostgreSQL            ████████     Intermediate
  ▶ MySQL                 ███████      Intermediate

Tools & Technologies:
  ▶ Git/GitHub            ████████████ Expert
  ▶ Docker                ████████     Intermediate
  ▶ AWS/Cloud Services    ███████      Intermediate
  ▶ CI/CD                 ███████      Intermediate
        `;
        this.addOutput(skillsText, 'success');
    }

    showEducation() {
        const educationText = `
🎓 Education:
──────────────────────────────────────────

🏛️  [University Name]
    Bachelor of Science in Computer Science
    📅 Graduation: [Year]
    🏆 GPA: [X.X/4.0] (if you want to include)
    
    Relevant Coursework:
    • Data Structures & Algorithms
    • Software Engineering
    • Database Systems
    • Web Development
    • Machine Learning

📚 Certifications & Additional Learning:
    • [Any relevant certifications]
    • [Online courses completed]
    • [Technical workshops attended]

🌟 Academic Achievements:
    • [Any honors, awards, or notable projects]
    • [Research work or publications]
        `;
        this.addOutput(educationText, 'info');
    }

    showExperience() {
        const experienceText = `
💼 Professional Experience:
──────────────────────────────────────────

👨‍💻 [Current/Most Recent Position]
    [Company Name] | [Start Date] - [End Date/Present]
    
    🎯 Key Responsibilities:
       • [Responsibility 1]
       • [Responsibility 2]
       • [Responsibility 3]
    
    🏆 Achievements:
       • [Achievement 1]
       • [Achievement 2]

👨‍💻 [Previous Position]
    [Company Name] | [Start Date] - [End Date]
    
    🎯 Key Responsibilities:
       • [Responsibility 1]
       • [Responsibility 2]
    
    🏆 Achievements:
       • [Achievement 1]
       • [Achievement 2]

📈 Career Highlights:
    • [Major project or accomplishment]
    • [Recognition or award received]
    • [Skills developed or technologies mastered]
        `;
        this.addOutput(experienceText, 'success');
    }

    catCommand(args) {
        if (args.length === 0) {
            this.addOutput('cat: missing file operand', 'error');
            return;
        }

        const filename = args[0];
        const files = {
            'readme.txt': 'Welcome to Kylin Wang\'s terminal portfolio!\nThis interactive terminal showcases my skills and projects.',
            'about.txt': 'Passionate software engineer with expertise in full-stack development.',
            'projects.txt': 'Check out my projects using the "ls" command!'
        };

        if (files[filename]) {
            this.addOutput(files[filename], 'text');
        } else {
            this.addOutput(`cat: ${filename}: No such file or directory`, 'error');
        }
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
                <span class="prompt">kylinwang@io:~$</span>
                <span class="command">Welcome to Kylin Wang's Terminal Portfolio</span>
            </div>
            <div class="line">
                <span class="text">Type 'help' to see available commands.</span>
            </div>
            <div class="line"></div>
        `;
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
