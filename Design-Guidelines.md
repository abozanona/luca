
# Design Guidelines

This document aims to specify and define the rules and patterns to follow when implementing and developing new features and components for ***Luca***.

>This is a summary. For a more extensive version, components and UI Design, visit the publically available **[Figma file](https://www.figma.com/file/5sKFpuOopGPv0EA9EjU5j8/Luca?node-id=1:3)**

## Table of contents
- [Design Guidelines](#design-guidelines)
  - [Table of contents](#table-of-contents)
  - [Color scheme](#color-scheme)
      - [Gray shades](#gray-shades)
  - [Typography](#typography)
      - [Web Embed](#web-embed)
  - [Spacing](#spacing)
  - [Doubts and questions](#doubts-and-questions)

## Color scheme

- **Primary**: `#007FFF`
- **Secondary**: `#15153A`
- **background**: `#F7F7F7`
- **Pure White**: `#FFFFFF`
-  **Text**: `#A4A4A4`

#### Gray shades
- **Gray 100**: `#DEE3EA`
- **Gray 200**: `#B2BDCD`
- **Gray 300**: `#5D7290`
- **~~Gray 400~~**: `#4F617A`
- **~~Gray 500~~**: `#404F64`
- **~~Gray 600~~**: `#323D4D`
- **Gray 700**: `#242C37`
- **Gray 800**: `#151A21`
- **Gray 900**: `#0B0E11`

#### System Colors
- **Error**: `#ED2121`
- **Warning**: `#FFC539`
- **Success**: `#72C850`

![enter image description here](https://i.ibb.co/tcdffzX/image.png)

## Typography

The font chosen for this project is `Filson Pro`.

Filson Pro is a free font . Clean and bold headings, readable paragraph text and an overall versatile font.

We'll be using two of its styles:
- Filson Pro Bold (`700`)
- Filson Pro Medium (`500`)
- Filson Pro Regular (`400`)

#### Web Embed

HTML's `link` method

```html
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Filson Pro:wght@500;700&display=swap" rel="stylesheet">
```

CSS/SCSS `@import`

```css
@import url('https://fonts.googleapis.com/css2?family=Filson Pro:wght@500;700&display=swap');
```

CSS Rules

```scss
font-family: 'Filson Pro', sans-serif;
// Bold
font-weight: 700;

// Medium
font-weight: 500;

// Regular
font-weight: 400;
```

![enter image description here](https://i.ibb.co/rfWdkJ2/image.png)

Tag | Font Size | Line Height | Weight
--- | --------- | ----------- | ------
**H1** | 56px | 90 | 700
**H2** | 40px | 64 | 700
**H3** | 28px | 45 | 700
**H4** | 20px | 32 | 700
**P** | 14px | 22 | 500 - 700
**P (small)** | 12px | 22 | 500 - 700

## Spacing

This is an approximation. On some circumstances other values will be used to ensure readability, consistency and visual balance, so make sure to also check the UI Design and the spacing used there.

![enter image description here](https://i.ibb.co/w697nPj/image.png)

## Doubts and questions
If you have any doubts or concerns when developing components or other UI elements, you can open an issue and tag @MahmouDSkafi or leave a message in `#design`.
