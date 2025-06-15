# Contributing to Qastra

Thank you for considering contributing to Qastra! Your help is invaluable in making this Q&A system robust, user-friendly, and accessible to everyone. This guide will help you get started and understand our contribution process.

## Table of Contents

* [Code of Conduct](#code-of-conduct)
* [How Can I Contribute?](#how-can-i-contribute)
    * [Reporting Bugs](#reporting-bugs)
    * [Suggesting Enhancements](#suggesting-enhancements)
    * [Your First Code Contribution](#your-first-code-contribution)
    * [Pull Request Guidelines](#pull-request-guidelines)
* [Setting up Your Local Development Environment](#setting-up-your-local-development-environment)
    * [Prerequisites](#prerequisites)
    * [Cloning the Repository](#cloning-the-repository)
    * [Backend Setup (Node.js/Express)](#backend-setup-nodejs-express)
    * [Frontend Setup (React)](#frontend-setup-react)
    * [Running the Application](#running-the-application)
* [Coding Style and Guidelines](#coding-style-and-guidelines)
    * [Frontend (React & Tailwind CSS)](#frontend-react--tailwind-css)
    * [Backend (Node.js/Express)](#backend-nodejs-express)
    * [Git Commit Messages](#git-commit-messages)
* [License](#license)

---

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms. We strive to create a welcoming and inclusive community.

---

## How Can I Contribute?

There are many ways you can contribute to Qastra, even if you're not writing code!

### Reporting Bugs

Found something that isn't working as expected? Please help us by reporting it!

1.  **Check Existing Issues:** Before opening a new issue, please search the [GitHub Issues page](https://github.com/DeveloperPuneet/Qastra/issues) to see if the bug has already been reported.
2.  **Open a New Issue:** If it's a new bug, click "New Issue" and select "Bug Report".
3.  **Provide Detailed Information:**
    * **A clear, concise title:** Summarize the bug (e.g., "Login button not responsive on mobile").
    * **Steps to reproduce:** Describe the exact steps to consistently reproduce the bug.
    * **Expected behavior:** What did you expect to happen?
    * **Actual behavior:** What actually happened?
    * **Screenshots/Videos (highly recommended):** If applicable, add visual aids demonstrating the issue.
    * **Your environment:** Include details like browser (name and version), operating system, Node.js version, etc.

### Suggesting Enhancements

Have an idea for a new feature, a performance improvement, or a general enhancement? We'd love to hear your thoughts!

1.  **Check Existing Issues:** Search if your idea has already been discussed.
2.  **Open a New Issue:** If not, click "New Issue" and select "Feature Request" or "Enhancement".
3.  **Describe Your Suggestion:**
    * **A clear, concise title:** Briefly describe the enhancement (e.g., "Add user profile page").
    * **Problem it solves:** Explain the real-world problem or limitation your enhancement addresses.
    * **Proposed solution:** Describe how you envision the enhancement working. Mockups or examples are very helpful if you have them.

### Your First Code Contribution

If you're new to contributing to open source or just new to Qastra's codebase, we highly recommend looking for issues labeled `good first issue` or `help wanted` on our [issues page](https://github.com/DeveloperPuneet/Qastra/issues). These are typically smaller, well-defined tasks designed to help you get familiar with the project.

### Pull Request Guidelines

Once you've made your code changes, follow these steps to submit them for review:

1.  **Fork the Repository:** Click the "Fork" button at the top right of the [Qastra repository page](https://github.com/DeveloperPuneet/Qastra). This creates a copy under your GitHub account.
2.  **Clone Your Fork:**
    ```bash
    git clone [https://github.com/DeveloperPuneet/Qastra.git](https://github.com/DeveloperPuneet/Qastra.git)
    cd Qastra
    ```
3.  **Create a New Branch:** Always work on a new branch for your changes.
    ```bash
    git checkout -b feature/your-feature-name # for new features
    # or
    git checkout -b bugfix/issue-description # for bug fixes
    ```
4.  **Make Your Changes:** Implement your feature or bug fix. Ensure you follow our [Coding Style and Guidelines](#coding-style-and-guidelines).
5.  **Test Your Changes:** Verify that your changes work as expected and haven't introduced any new issues.
6.  **Commit Your Changes:** Write clear and concise commit messages following our [Git Commit Message guidelines](#git-commit-messages).
    ```bash
    git add .
    git commit -m "feat: your concise commit message"
    ```
7.  **Push to Your Fork:**
    ```bash
    git push origin your-branch-name
    ```
8.  **Open a Pull Request (PR):**
    * Go to the original [Qastra repository](https://github.com/DeveloperPuneet/Qastra).
    * GitHub will usually display a "Compare & pull request" button or banner. Click it.
    * **Title:** Provide a clear and concise title for your PR (e.g., "Fix: Mobile header layout issue").
    * **Description:** In the description, explain what your PR does, why it's necessary, and explicitly reference any related issues (e.g., "Closes #123" if it fixes issue number 123).
    * Be ready to respond to feedback from the maintainers. We might ask for clarifications or suggest improvements.

---

## Setting up Your Local Development Environment

To get Qastra up and running on your local machine, follow these steps:

### Prerequisites

* **Node.js:** v14.x or higher (LTS versions are recommended).
* **npm** (comes with Node.js) or **Yarn**.
* **MongoDB:** A running instance of MongoDB. This can be a local installation or a cloud-based service like MongoDB Atlas.

### Cloning the Repository

Start by cloning your forked repository:

```bash
git clone [https://github.com/DeveloperPuneet/Qastra.git](https://github.com/DeveloperPuneet/Qastra.git)
cd Qastra
