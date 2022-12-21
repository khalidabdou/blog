import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'

const CodeBlock = ({ code, language }) => {
  return (
    <Highlight {...defaultProps} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className + ' rounded-lg p-11'} style={style}>
          {tokens.map((line, i) => (
            // eslint-disable-next-line react/jsx-key
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, keyq) => (
                <span key={keyq} {...getTokenProps({ token, keyq })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

export default CodeBlock
