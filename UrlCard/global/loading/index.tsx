import * as React from 'react';

const Loading = ({ isLoading }:any) => (
  isLoading && <p className="result-count">Searching...</p>
);

export default Loading;
