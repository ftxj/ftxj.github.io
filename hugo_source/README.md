# JXIN's Personal Website

This is the Hugo source code for my personal website at [https://ftxj.github.io](https://ftxj.github.io)

## Tech Stack

- **Static Site Generator**: [Hugo](https://gohugo.io/)
- **Theme**: [Hugo Coder](https://github.com/luizdepra/hugo-coder)
- **Hosting**: GitHub Pages

## Prerequisites

- Hugo (Extended version recommended)

### Install Hugo

**macOS:**
```bash
brew install hugo
```

**Linux:**
```bash
snap install hugo
```

**Windows:**
```bash
choco install hugo-extended
```

## Local Development

1. Clone this repository:
```bash
git clone https://github.com/ftxj/ftxj.github.io-source.git
cd ftxj.github.io-source
```

2. Start the Hugo development server:
```bash
hugo server -D
```

3. Open your browser and visit `http://localhost:1313`

## Creating New Posts

```bash
hugo new posts/my-new-post.md
```

## Building the Site

```bash
hugo
```

The generated static site will be in the `public/` directory.

## Deployment

To deploy to GitHub Pages:

```bash
./deploy.sh
```

This will:
1. Build the site with Hugo
2. Push the generated files to the `master` branch of ftxj.github.io

## Project Structure

```
.
├── archetypes/          # Content templates
├── content/             # Markdown content
│   ├── posts/          # Blog posts
│   └── about/          # About page
├── static/              # Static assets (images, etc.)
├── themes/              # Hugo themes
│   └── hugo-coder/     # Coder theme
├── config.toml          # Site configuration
├── deploy.sh            # Deployment script
└── README.md
```

## License

Content © 2019-2024 Jie Xin

## Contact

- Email: jiexin@nvidia.com
- GitHub: [@ftxj](https://github.com/ftxj)

