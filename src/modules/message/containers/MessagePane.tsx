import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { MessageState } from 'modules/message/duck';
import { RootState, RootDispatch } from 'root';
import { loadAll } from '../duck';

interface MessagePaneProps {
  message: MessageState;
  dispatch: RootDispatch;
}

export const MessagePane: React.FC<MessagePaneProps> = props => {
  const { dispatch } = props;
  useEffect(() => { dispatch(loadAll('')) }, [ dispatch ]);

  if (props.message.loadAllStatus.loading) {
    return <span>loading...</span>;
  }

  return (
    <ul>
      {props.message.messages.map(message => (
        <li key={message.id}>{message.text}</li>
      ))}
    </ul>
  );
};

const mapStateToProps = (state: RootState) => ({
  message: state.message,
});

export const MessagePaneContainer = connect(mapStateToProps)(MessagePane);
