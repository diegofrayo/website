import * as React from "react";
import classNames from "classnames";

import { Page } from "~/components/layout";
import {
  Block,
  Icon,
  Image,
  InlineText,
  Link,
  List,
  Space,
  Text,
  Title,
} from "~/components/primitive";
import { GoBack } from "~/components/shared";
import { useTranslation } from "~/i18n";
import { ROUTES } from "~/utils/routing";
import { generateSlug } from "~/utils/strings";
import { isNotEmptyString } from "~/utils/validations";
import type { T_ReactChildren, T_ReactElement } from "~/types";

export default function ResumePage({ resume }: { resume: T_Resume }): T_ReactElement {
  // hooks
  const { t } = useTranslation();

  // render
  return (
    <Page
      config={{
        title: t("seo:title"),
        description: t("seo:description"),
        pathname: ROUTES.RESUME,
        disableSEO: Boolean(t("page:config:is_seo_disabled")),
      }}
    >
      <Block
        is="main"
        className="tw-relative tw-mx-auto tw-px-8 tw-py-16 dfr-max-w-layout dfr-shadow print:tw-w-full print:tw-shadow-none"
      >
        <GoBack className="tw-absolute tw-top-0 print:tw-hidden" />
        <PrintBlock>
          <Block
            is="header"
            className="tw-text-center"
          >
            <Image
              src={resume.profilePhoto}
              alt="Profile photo"
              className="tw-mx-auto tw-h-32 tw-w-32 tw-rounded-full dfr-shadow"
            />
            <Space size={2} />

            <Title is="h1">{resume.fullName}</Title>
            <Space size={2} />

            <Text>{resume.headline}</Text>
            <Space size={1} />

            <Text className="tw-text-xs tw-italic dfr-text-color-secondary">
              <InlineText>{resume.location.city}</InlineText> <InlineText> / </InlineText>
              <InlineText>{resume.location.country}</InlineText>
            </Text>
            <Space size={4} />

            <Block className="tw-text-center">
              <Link
                variant={Link.variant.SIMPLE}
                href={`mailto:${resume.contactInfo.email}`}
                className="tw-mx-2 tw-inline-block"
                isExternalLink
              >
                <Icon
                  icon={Icon.icon.GMAIL}
                  size={32}
                />
              </Link>
              <Link
                variant={Link.variant.SIMPLE}
                href={resume.contactInfo.linkedin}
                className="tw-mx-2 tw-inline-block"
                isExternalLink
              >
                <Icon
                  icon={Icon.icon.LINKEDIN}
                  size={32}
                />
              </Link>
              {resume.contactInfo.websites.map((website) => {
                const isPersonalWebsite = website.name.toLowerCase().includes("website");

                return (
                  <Link
                    key={generateSlug(website.name)}
                    variant={Link.variant.SIMPLE}
                    href={website.value}
                    className="tw-mx-2 tw-inline-block"
                    isExternalLink
                  >
                    {isPersonalWebsite ? (
                      <Icon
                        icon={Icon.icon.GLOBE_ALT}
                        size={38}
                      />
                    ) : (
                      <Icon
                        icon={Icon.icon.GITHUB}
                        size={31}
                      />
                    )}
                  </Link>
                );
              })}
            </Block>
          </Block>
        </PrintBlock>

        <Block>
          <PrintBlock>
            <ResumeBlock title="Summary">
              <pre className="tw-whitespace-pre-line tw-break-words  dfr-font-family md:tw-text-justify">
                {resume.summary}
              </pre>
            </ResumeBlock>
            <ResumeBlock title="Education">
              <Block>
                {resume.education.map((item) => {
                  return (
                    <Block
                      key={generateSlug(item.degree)}
                      className="tw-mb-4 tw-flex tw-items-start last:tw-mb-0"
                    >
                      <Image
                        src={item.schoolLogo}
                        alt={`${item.school} logo`}
                        className="tw-relative tw-top-1 tw-mr-2 tw-h-12 tw-w-12 tw-flex-shrink-0"
                      />
                      <Block>
                        <Title
                          is="h3"
                          variant={Title.variant.SECONDARY}
                          size={Title.size.MD}
                        >
                          {item.degree}
                        </Title>
                        <Link
                          variant={Link.variant.SIMPLE}
                          href={item.schoolWebsite}
                          className="tw-underline"
                          isExternalLink
                        >
                          {item.school}
                        </Link>
                        <Text className="tw-text-xs tw-italic dfr-text-color-secondary">
                          <InlineText>{item.startDate}</InlineText> /{" "}
                          <InlineText>{item.endDate}</InlineText>
                        </Text>
                      </Block>
                    </Block>
                  );
                })}
              </Block>
            </ResumeBlock>
          </PrintBlock>

          <PrintBlock fullPage={false}>
            <ResumeBlock title="Experience">
              <ExperienceTimeline experience={resume.experience} />
            </ResumeBlock>
          </PrintBlock>

          <ResumeBlock title="Skills">
            <List variant={List.variant.DEFAULT}>
              {resume.skills.map((item) => {
                return <List.Item key={generateSlug(item)}>{item}</List.Item>;
              })}
            </List>
          </ResumeBlock>
        </Block>
      </Block>
    </Page>
  );
}

// --- Components ---

function PrintBlock({
  children,
  fullPage = true,
}: {
  children: T_ReactChildren;
  fullPage?: boolean;
}): T_ReactElement {
  return <Block className={classNames(fullPage && "print:tw-h-screen")}>{children}</Block>;
}

type T_ResumeBlockProps = {
  title: string;
  children: T_ReactChildren;
};

function ResumeBlock({ title, children }: T_ResumeBlockProps): T_ReactElement {
  return (
    <Block
      is="section"
      className="tw-mt-16 tw-border-t tw-border-dashed tw-pt-16 dfr-border-color-primary print:tw-mt-0 print:tw-mb-16 print:tw-border-0 print:tw-pt-0"
    >
      <Title
        is="h2"
        className="tw-mx-auto tw-mb-8 tw-w-full tw-border-4 tw-py-1 tw-px-2 tw-text-center tw-uppercase dfr-border-color-dark-strong print:tw-w-72 md:tw-w-72"
      >
        {title}
      </Title>
      {children}
    </Block>
  );
}

type T_ExperienceTimelineProps = {
  experience: T_Experience[];
};

export function ExperienceTimeline({ experience }: T_ExperienceTimelineProps): T_ReactElement {
  return (
    <Block className="tw-ml-3 tw-border-l-4 tw-border-black dark:dfr-border-color-primary">
      {experience.map((item) => {
        return (
          <ExperienceTimelineItem
            key={item.id}
            item={item}
          />
        );
      })}
    </Block>
  );
}

function ExperienceTimelineItem({
  item: { role, company, companyLogo, companyWebsite, startDate, endDate, description },
}: {
  item: T_Experience;
}): T_ReactElement {
  return (
    <Block
      is="section"
      className="tw-relative tw-mb-8 tw-pl-9 last:tw-mb-0 print:tw-mb-20"
    >
      <Block className="tw-absolute tw--left-4 tw-top-0 tw-h-10 tw-w-10 tw-overflow-hidden tw-border-4 tw-border-black">
        {isNotEmptyString(companyLogo) ? (
          <Image
            src={companyLogo}
            alt="Company logo"
            className="tw-h-full tw-w-full"
          />
        ) : (
          <Block className="tw-h-full tw-w-full dfr-bg-color-dark-strong" />
        )}
      </Block>

      <Block>
        <Title
          is="h3"
          variant={Title.variant.SECONDARY}
          size={Title.size.MD}
        >
          {role}
        </Title>

        {isNotEmptyString(companyWebsite) ? (
          <Link
            className="tw-underline"
            href={companyWebsite}
            variant={Link.variant.SIMPLE}
            isExternalLink
          >
            {company}
          </Link>
        ) : (
          <Text>{company}</Text>
        )}

        <Text className="tw-text-xs tw-italic dfr-text-color-secondary">
          <InlineText>{startDate}</InlineText> /<InlineText>{endDate}</InlineText>
        </Text>
        <Space size={2} />

        <pre className="tw-whitespace-pre-line tw-break-words dfr-font-family print:tw-text-sm md:tw-text-justify">
          {description}
        </pre>
      </Block>
    </Block>
  );
}

// --- Types ---

type T_Resume = {
  profilePhoto: string;
  fullName: string;
  headline: string;
  location: T_Location;
  contactInfo: T_ContactInfo;
  summary: string;
  education: T_Education[];
  experience: T_Experience[];
  skills: string[];
};

type T_Location = {
  country: string;
  city: string;
};

type T_ContactInfo = {
  linkedin: string;
  websites: T_Website[];
  email: string;
};

type T_Website = {
  name: string;
  value: string;
};

type T_Education = {
  school: string;
  schoolWebsite: string;
  schoolLogo: string;
  degree: string;
  startDate: string;
  endDate: string;
};

type T_Experience = {
  // WARN: False positive
  // eslint-disable-next-line react/no-unused-prop-types
  id: string;
  role: string;
  company: string;
  companyLogo: string;
  companyWebsite: string;
  startDate: string;
  endDate: string;
  description: string;
};
