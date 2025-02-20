import getItemQualityLabel from 'common/getItemQualityLabel';
import ITEMS from 'common/ITEMS';
import TooltipProvider from 'interface/TooltipProvider';
import { useEffect, useState } from 'react';
import * as React from 'react';

import ItemIcon from './ItemIcon';

interface Props {
  id: number;
  children?: React.ReactNode;
  details?: {
    itemLevel: number;
    quality: number;
  };
  quality?: number;
  icon?: boolean;
}
export const EPIC_ITEMS_ILVL = 184;

const ItemLink = (props: Props) => {
  const [elem, setElem] = useState<HTMLAnchorElement | null>(null);

  useEffect(() => {
    TooltipProvider.refresh(elem);
  }, [elem, props.id]);

  const { id, children, details, ...others } = props;
  delete others.icon;
  delete others.quality;

  if (process.env.NODE_ENV === 'development' && !children && !ITEMS[id]) {
    throw new Error(`Unknown item: ${id}`);
  }

  let quality;
  if (props.quality !== undefined && props.quality !== null) {
    quality = props.quality;
  } else if (props.details) {
    quality = Math.max(props.details.itemLevel >= EPIC_ITEMS_ILVL ? 4 : 3, props.details.quality);
  } else {
    quality = ITEMS[id] ? ITEMS[id].quality : 0;
  }

  return (
    <a
      href={TooltipProvider.item(id, details)}
      target="_blank"
      rel="noopener noreferrer"
      className={getItemQualityLabel(quality) + 'item-link-text'}
      ref={(elem) => {
        setElem(elem);
      }}
      {...others}
    >
      {props.icon && (
        <>
          <ItemIcon id={id} noLink />{' '}
        </>
      )}
      {children || ITEMS[id].name}
    </a>
  );
};

ItemLink.defaultProps = { icon: true };

export default ItemLink;
