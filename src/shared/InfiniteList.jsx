import React, { useCallback, useEffect, useState } from "react";

import Sentinel from "@/shared/Sentinel.jsx";

function computeSize(pageSize, itemCount) {
  return Math.max(0, Math.min(pageSize, itemCount));
}

const ListContainerStyle = {
  flex: 1,
};

const InfiniteList = (props) => {
  const { initialIndex = 0, itemCount, pageSize = 30, renderItem } = props;

  // in SSR, size is always 0 event if there is items to be rendered.
  // because useEffect is called when this component is mounted which is not happening in SSR.
  // to solve this issue, need to set the size with pageSize as default.
  const [size, setSize] = useState(Math.min(itemCount, pageSize));

  useEffect(() => {
    const nextSize = computeSize(pageSize, itemCount);
    setSize(nextSize);
  }, [itemCount, pageSize]);

  const handleVisible = useCallback(
    (visibility) => {
      if (visibility) {
        setSize((s) => computeSize(s + pageSize, itemCount));
      }
    },
    [itemCount, pageSize]
  );

  const itemRenderer = renderItem ? renderItem : () => <></>;
  const items = [];

  for (let i = 0; i < size; ++i) {
    items.push(itemRenderer(initialIndex + i, i));
  }

  return (
    <div style={ListContainerStyle}>
      {items}
      {size < itemCount && (
        <Sentinel key="sentinel" onVisible={handleVisible} />
      )}
    </div>
  );
};

export default InfiniteList;
