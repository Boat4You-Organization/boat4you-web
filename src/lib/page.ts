import fs from 'fs';
import path from 'path';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';

import { Accordion } from '@/types/accordion.type';
import { FAQGroup } from '@/types/faq.type';

export type PostType = 'static';

const markdownToHtml = async (content: string) => {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return result.toString();
};

export const getPage = async (locale: string, postType: PostType, fileName: string): Promise<string | null> => {
  const filePath = path.join(process.cwd(), `src/posts/${postType}`, locale, `${fileName}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  return markdownToHtml(fileContent);
};

export const parseFAQMarkdown = async (content: string): Promise<FAQGroup[]> => {
  const lines = content.split('\n');

  const parseResult = lines.reduce<{
    groups: Array<FAQGroup & { questions: Array<{ title: string; content: string; rawContent: string }> }>;
    currentGroup: (FAQGroup & { questions: Array<{ title: string; content: string; rawContent: string }> }) | null;
    currentQuestion: { title: string; content: string; rawContent: string } | null;
    contentBuffer: string[];
  }>(
    (acc, line) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('## ')) {
        if (acc.currentQuestion && acc.currentGroup) {
          acc.currentQuestion.rawContent = acc.contentBuffer.join('\n').trim();
          acc.currentGroup.questions.push(acc.currentQuestion);
        }

        if (acc.currentGroup) {
          acc.groups.push(acc.currentGroup);
        }

        return {
          ...acc,
          currentGroup: {
            title: trimmedLine.substring(2).trim(),
            questions: [],
          },
          currentQuestion: null,
          contentBuffer: [],
        };
      }

      if (trimmedLine.startsWith('## ')) {
        if (acc.currentQuestion && acc.currentGroup) {
          acc.currentQuestion.rawContent = acc.contentBuffer.join('\n').trim();
          acc.currentGroup.questions.push(acc.currentQuestion);
        }

        return {
          ...acc,
          currentQuestion: {
            title: trimmedLine.substring(3).trim(),
            content: '',
            rawContent: '',
          },
          contentBuffer: [],
        };
      }

      if (acc.currentQuestion) {
        return {
          ...acc,
          contentBuffer: [...acc.contentBuffer, line],
        };
      }

      return acc;
    },
    {
      groups: [],
      currentGroup: null,
      currentQuestion: null,
      contentBuffer: [],
    }
  );

  if (parseResult.currentQuestion && parseResult.currentGroup) {
    parseResult.currentQuestion.rawContent = parseResult.contentBuffer.join('\n').trim();
    parseResult.currentGroup.questions.push(parseResult.currentQuestion);
  }

  if (parseResult.currentGroup) {
    parseResult.groups.push(parseResult.currentGroup);
  }

  const allQuestions = parseResult.groups.flatMap(group => group.questions);
  const htmlContents = await Promise.all(allQuestions.map(question => markdownToHtml(question.rawContent)));

  let questionIndex = -1;
  const finalGroups: FAQGroup[] = parseResult.groups.map(group => ({
    title: group.title,
    questions: group.questions.map(question => {
      questionIndex += 1;

      const htmlContent = htmlContents[questionIndex];

      return {
        title: question.title,
        content: htmlContent,
      };
    }),
  }));

  return finalGroups;
};

export const getFAQPage = async (locale: string, postType: PostType, fileName: string): Promise<FAQGroup[] | null> => {
  const filePath = path.join(process.cwd(), `src/posts/${postType}`, locale, `${fileName}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  return parseFAQMarkdown(fileContent);
};

export const getFAQByCategory = async (
  locale: string,
  postType: PostType,
  fileName: string,
  category: string
): Promise<Accordion[] | null> => {
  const allGroups = await getFAQPage(locale, postType, fileName);

  if (!allGroups) return null;

  const categoryGroup = allGroups.find(group => group.title.toLowerCase() === category.toLowerCase());

  return categoryGroup ? categoryGroup.questions : null;
};
