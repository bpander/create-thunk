import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { sendMessage } from 'modules/message/duck';
import { RootDispatch } from 'root';

interface MessageFormProps {
  sendMessage: (text: string) => void;
}

export const MessageForm: React.FC<MessageFormProps> = props => {
  const [ message, setMessage ] = useState('');

  const onSubmit: React.FormEventHandler = e => {
    e.preventDefault();
    props.sendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={onSubmit}>
      <input value={message} onChange={e => setMessage(e.currentTarget.value)} />
      <button>Submit</button>
    </form>
  );
};

const mapDispatchToProps = (dispatch: RootDispatch) => bindActionCreators({
  sendMessage,
}, dispatch);

export const MessageFormContainer = connect(null, mapDispatchToProps)(MessageForm);
