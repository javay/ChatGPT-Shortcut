/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import copy from 'copy-text-to-clipboard';
import Image from '@theme/IdealImage';
import FavoriteIcon from '@site/src/components/svgIcons/FavoriteIcon';
import {
  Tags,
  TagList,
  type TagType,
  type User,
  type Tag,
} from '@site/src/data/users';
import {sortBy} from '@site/src/utils/jsUtils';
import Heading from '@theme/Heading';
import Tooltip from '@site/src/pages/_components/ShowcaseTooltip';
import styles from '@site/src/pages/_components/ShowcaseCard/styles.module.css';

const TagComp = React.forwardRef<HTMLLIElement, Tag>(
  ({label, color, description}, ref) => (
    <li ref={ref} className={styles.tag} title={description}>
      <span className={styles.textLabel}>{label.toLowerCase()}</span>
      <span className={styles.colorLabel} style={{backgroundColor: color}} />
    </li>
  ),
);

function ShowcaseCardTag({tags}: {tags: TagType[]}) {
  const tagObjects = tags.map((tag) => ({tag, ...Tags[tag]}));

  // Keep same order for all tags
  const tagObjectsSorted = sortBy(tagObjects, (tagObject) =>
    TagList.indexOf(tagObject.tag),
  );

  return (
    <>
      {tagObjectsSorted.map((tagObject, index) => {
        const id = `showcase_card_tag_${tagObject.tag}`;

        return (
          <Tooltip
            key={index}
            text={tagObject.description}
            anchorEl="#__docusaurus"
            id={id}>
            <TagComp key={index} {...tagObject} />
          </Tooltip>
        );
      })}
    </>
  );
}

function getCardImage(user: User): string {
  return (
    user.preview ??
    `https://slorber-api-screenshot.netlify.app/${encodeURIComponent(
      user.website,
    )}/showcase`
  );
}

function ShowcaseCard({user}: {user: User}) {
  const image = getCardImage(user);
  const [copied, setShowCopied] = useState(false);
  const handleCopyCode = () => {
    if (user.description) {
      copy(user.description);
    }
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };
  return (
    <li key={user.title_en} className="card shadow--md">
      {/* <div className={clsx('card__image', styles.showcaseCardImage)}>
        <Image img={image} alt={user.title} />
      </div> */}
      <div className={clsx('card__body', styles.cardBodyHeight)}>
        <div className={clsx(styles.showcaseCardHeader)}>
          <Heading as="h4" className={styles.showcaseCardTitle}>
            <Link href={user.website} className={styles.showcaseCardLink}>
              {user.title_en}
            </Link>
          </Heading>
          {user.tags.includes('favorite') && (
            <FavoriteIcon svgClass={styles.svgIconFavorite} size="small" />
          )}
          {/* {user.source && (
            <Link
              href={user.source}
              className={clsx(
                'button button--secondary button--sm',
                styles.showcaseCardSrcBtn,
              )}>
              <Translate id="showcase.card.sourceLink">source</Translate>
            </Link>
          )} */}
          <button
            className={clsx(
              'button button--secondary button--sm',
              styles.showcaseCardSrcBtn,
            )}
            type="button"
            onClick={handleCopyCode}
          >
            {copied ? <Translate>已复制</Translate> : <Translate>复制</Translate>}
          </button>
        </div>
        <p className={styles.showcaseCardBody}>👉 {user.remark_en}</p>
        <p className={styles.showcaseCardBody}>{user.desc_en}</p>
      </div>
      <ul className={clsx('card__footer', styles.cardFooter)}>
        <ShowcaseCardTag tags={user.tags} />
      </ul>
    </li>
  );
}

export default React.memo(ShowcaseCard);