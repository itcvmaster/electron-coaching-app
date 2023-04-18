import React, { forwardRef } from "react";
import { styled } from "goober";

const StyledDiv = styled("div")`
  display: flex;
  flex-direction: column;
`;

const ViewBlock = forwardRef((props, ref) => {
  const { ...restProps } = props;
  return <StyledDiv ref={ref} {...restProps} />;
});

ViewBlock.displayName = "View";

const View = styled(ViewBlock)``;

function SearchResultListView(props) {
  const {
    data,
    renderItem,
    renderSeparatorComponent,
    renderEmptyComponent,
    renderHeaderComponent,
    renderFooterComponent,
    renderEmptyListPlaceholder,
    renderLastSeparator,
    setKey,
    ...restProps
  } = props;
  if (!data) return null;
  if (data.length === 0 && renderEmptyComponent) return renderEmptyComponent();
  const Wrapper = React.Fragment;
  return (
    <View {...restProps}>
      <>
        {renderHeaderComponent && renderHeaderComponent()}
        {(data || []).length === 0
          ? renderEmptyListPlaceholder && renderEmptyListPlaceholder()
          : data.map((item, i) => (
              <Wrapper key={setKey ? setKey(item, i) : i}>
                {renderItem(item, i)}
                {renderSeparatorComponent &&
                  (i !== data.length - 1 || renderLastSeparator) &&
                  renderSeparatorComponent(item, i)}
              </Wrapper>
            ))}
        {renderFooterComponent && renderFooterComponent()}{" "}
      </>
    </View>
  );
}

export default SearchResultListView;
