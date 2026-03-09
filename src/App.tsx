import { Deck, Slide, Heading, Text, FlexBox, FullScreen, Progress, Box } from 'spectacle';

const theme = {
  colors: {
    primary: '#1a1a2e',
    secondary: '#16213e',
    tertiary: '#0f3460',
    quaternary: '#e94560',
    quinary: '#f5f5f5',
  },
  fonts: {
    header: '"Inter", sans-serif',
    text: '"Inter", sans-serif',
    monospace: '"Fira Code", monospace',
  },
};

const template = () => (
  <FlexBox
    justifyContent="space-between"
    position="absolute"
    bottom={0}
    width={1}
    padding="0 16px 8px"
  >
    <Box>
      <FullScreen color="#e94560" />
    </Box>
    <Box>
      <Progress color="#e94560" />
    </Box>
  </FlexBox>
);

function App() {
  return (
    <Deck theme={theme} template={template}>
      <Slide backgroundColor="primary">
        <FlexBox height="100%" flexDirection="column" alignItems="center" justifyContent="center">
          <Heading color="quinary">Hello, Spectacle!</Heading>
          <Text color="quaternary">簡報內容待補充</Text>
        </FlexBox>
      </Slide>
    </Deck>
  );
}

export default App;
