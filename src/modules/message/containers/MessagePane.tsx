import React from 'react';
import { connect } from 'react-redux';

import { Message } from 'modules/message/types';
import { RootState } from 'root';

interface MessagePaneProps {
  messages: Message[];
}

export const MessagePane: React.FC<MessagePaneProps> = props => {
  return (
    <ul>
      {props.messages.map(message => (
        <li key={message.id}>{message.text}</li>
      ))}
    </ul>
  );
};

const mapStateToProps = (state: RootState) => ({
  messages: state.message.messages,
});

export const MessagePaneContainer = connect(mapStateToProps)(MessagePane);
