import { getLocale, getTranslations } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { FleetEntry, FleetPage, fleetPagePath } from '@/utils/static/fleetIndex';
import { nameRepeatsModel, toTitleCase } from '@/utils/static/toTitleCase';
import { yachtsIndexPath } from '@/utils/static/yachtModelKey';

import styles from './FleetDirectory.module.scss';

interface FleetGroup {
  base: string;
  entries: FleetEntry[];
}

/**
 * Server-rendered A-Z directory of the whole promoted catalogue.
 *
 * Deliberately plain markup (no MUI, no client components, no client state):
 * every boat has to be a real `<a href="/boat/…">` in the HTML a crawler
 * receives on a parameter-free request, and this page is nothing but 300 of
 * them. Plain anchors, not next-intl's `<Link>` (audit 7.10.2026): a Link is a
 * client component, so each row also went into the page's RSC payload as a
 * client reference with its own props (~175 KB of the ~750 KB page), and each
 * row carried four long CSS-module class names in the HTML and again in the
 * payload. The rows are styled from the list's one class instead. A click on a
 * boat is a normal page load — the directory has nothing to keep in memory.
 */
const FleetDirectory = async ({ slice }: { slice: FleetPage }) => {
  const [locale, t, tModels, tCapacity] = await Promise.all([
    getLocale(),
    getTranslations('metadata.fleet'),
    getTranslations('models'),
    getTranslations('capacity'),
  ]);
  // as-needed locale prefix: English at the root, the rest under /{locale}.
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

  // Headings restart on every page — the home base is the single most
  // useful thing to scan a charter fleet by, and it keeps each page's
  // visible copy distinct from its siblings.
  const groups: FleetGroup[] = [];

  slice.entries.forEach(entry => {
    const last = groups[groups.length - 1];

    if (last && last.base === entry.base) {
      last.entries.push(entry);

      return;
    }

    groups.push({ base: entry.base, entries: [entry] });
  });

  const pageNumbers = Array.from({ length: slice.totalPages }, (_, index) => index + 1);

  return (
    <section className={styles.root}>
      <h1 className={styles.title}>{t('heading')}</h1>
      <p className={styles.lede}>{t('lede')}</p>
      <p className={styles.modelsLink}>
        <a href={`${prefix}${yachtsIndexPath()}`} className={styles.modelsAnchor}>
          {tModels('index.h1')} →
        </a>
      </p>
      <p className={styles.summary}>
        {t('summary', {
          total: slice.totalBoats,
          page: String(slice.pageNumber),
          pages: String(slice.totalPages),
        })}
      </p>

      {groups.map(group => (
        <div key={`${slice.pageNumber}-${group.base}`} className={styles.group}>
          <h2 className={styles.groupTitle}>{group.base || t('otherBases')}</h2>
          <ul className={styles.list}>
            {group.entries.map(entry => {
              const specs = [
                entry.buildYear ? String(entry.buildYear) : null,
                entry.cabins ? t('cabins', { count: entry.cabins }) : null,
                // The partner's max. people on board ("max. 12 people"), not "guests".
                entry.maxPersons ? tCapacity('compact.maxPeople', { count: entry.maxPersons }) : null,
              ]
                .filter(Boolean)
                .join(' · ');

              // The partner's name title-cased and trimmed like on the cards
              // ("LADIES&GENTLEMEN" reads "Ladies&Gentlemen", "MURDOCK "
              // "Murdock"; display only, live check 8.10.2026 B1).
              const name = toTitleCase(entry.name);

              // Model first, the vessel name (when it adds to the model) in a
              // second <span>, the specs in <small> — the list's stylesheet
              // tells them apart by element, not by class.
              return (
                <li key={entry.slug}>
                  <a href={`${prefix}/boat/${entry.slug}`}>
                    <span>{entry.modelName}</span>
                    {name && !nameRepeatsModel(entry.modelName, name) && <span>{name}</span>}
                    {specs && <small>{specs}</small>}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {slice.totalPages > 1 && (
        <nav aria-label={t('paginationLabel')} className={styles.pagination}>
          {pageNumbers.map(number =>
            number === slice.pageNumber ? (
              <span key={number} aria-current="page" className={styles.pageCurrent}>
                {number}
              </span>
            ) : (
              <a
                key={number}
                href={`${prefix}${fleetPagePath(number)}`}
                className={styles.pageLink}
                {...(number === slice.pageNumber - 1 ? { rel: 'prev' } : {})}
                {...(number === slice.pageNumber + 1 ? { rel: 'next' } : {})}
              >
                {number}
              </a>
            )
          )}
        </nav>
      )}
    </section>
  );
};

export default FleetDirectory;
