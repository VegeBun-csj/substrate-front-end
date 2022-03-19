import React from 'react'
import { Button, Card, Grid, Message, Modal, Form, Label } from 'semantic-ui-react'

import KittyAvatar from './KittyAvatar'
import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

// --- About Modal ---

const TransferModal = props => {
  const { kitty, accountPair, setStatus } = props
  const [open, setOpen] = React.useState(false)
  const [formValue, setFormValue] = React.useState({})

  const formChange = key => (ev, el) => {
    setFormValue({ ...formValue, [key]: el.value })
  }

  const confirmAndClose = (unsub) => {
    unsub()
    setOpen(false)
  }

  return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button basic color='blue'>售卖</Button>}>
    <Modal.Header>版权售卖</Modal.Header>
    <Modal.Content><Form>
      <Form.Input fluid label='版权 ID' readOnly value={kitty.id}/>
      <Form.Input fluid label='售卖金额' placeholder='金额' onChange={formChange('target')}/>
    </Form></Modal.Content>
    <Modal.Actions>
      <Button basic color='grey' onClick={() => setOpen(false)}>取消</Button>
      <TxButton
        accountPair={accountPair} label='确认售卖' type='SIGNED-TX' setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'kittiesModule',
          callable: 'sell_kitties',
          inputParams: [kitty.id, formValue.target],
          paramFields: [true, true]
        }}
      />
    </Modal.Actions>
  </Modal>
}

// const SellModal = props => {
//   const { kitty, accountPair, setStatus } = props
//   const [open, setOpen] = React.useState(false)
//   const [formValue, setFormValue] = React.useState({})

//   const formChange = key => (ev, el) => {
//     setFormValue({ ...formValue, [key]: el.value })
//   }

//   const confirmAndClose = (unsub) => {
//     unsub()
//     setOpen(false)
//   }

//   return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
//     trigger={<Button basic color='blue'>售卖</Button>}>
//     <Modal.Header>版权售卖</Modal.Header>
//     <Modal.Content><Form>
//       <Form.Input fluid label='毛孩 ID' readOnly value={kitty.id}/>
//       <Form.Input fluid label='转让对象' placeholder='挂单金额' onChange={formChange('target')}/>
//     </Form></Modal.Content>
//     <Modal.Actions>
//       <Button basic color='grey' onClick={() => setOpen(false)}>取消</Button>
//       <TxButton
//         accountPair={accountPair} label='确认售卖' type='SIGNED-TX' setStatus={setStatus}
//         onClick={confirmAndClose}
//         attrs={{
//           palletRpc: 'kittiesModule',
//           callable: 'sell_kitties',
//           inputParams: [formValue.target, kitty.id],
//           paramFields: [true, true]
//         }}
//       />
//     </Modal.Actions>
//   </Modal>
// }



// const KittyCard2 = props => {
//   const { kitty, setStatus } = props
//   const { id = null, dna = null, owner = null } = kitty
//   const displayDna = dna && dna.join(', ')
//   const { currentAccount } = useSubstrateState()
//   const displayId = id === null ? '' : (id < 10 ? `0${id}` : id.toString())
//   const isSelf = currentAccount.address === kitty.owner

//   return <Card>
//     { isSelf && <Label as='a' floating color='teal'>我的</Label> }
//     <KittyAvatar dna={dna} />
//     <Card.Content>
//       <Card.Header>ID 号: {displayId}</Card.Header>
//       <Card.Meta style={{ overflowWrap: 'break-word' }}>
//         版权哈希: <br/>
//         {displayDna}
//       </Card.Meta>
//       <Card.Description>
//         <p style={{ overflowWrap: 'break-word' }}>
//           版权所有者:<br/>
//           {owner}
//         </p>
//       </Card.Description>
//     </Card.Content>
//     <Card.Content extra style={{ textAlign: 'center' }}>{ owner === currentAccount.address
//       ? <SellModal kitty={kitty} accountPair={currentAccount} setStatus={setStatus}/>
//       : ''
//     }</Card.Content>
//   </Card>
// }

// --- About Kitty Card ---

const KittyCard = props => {
  const { kitty, setStatus } = props
  const { id = null, dna = null, owner = null } = kitty
  const displayDna = dna && dna.join(', ')
  const { currentAccount } = useSubstrateState()
  const displayId = id === null ? '' : (id < 10 ? `0${id}` : id.toString())
  const isSelf = currentAccount.address === kitty.owner

  return <Card>
    { isSelf && <Label as='a' floating color='teal'>我的</Label> }
    <KittyAvatar dna={dna} />
    <Card.Content>
      <Card.Header>ID 号: {displayId}</Card.Header>
      <Card.Meta style={{ overflowWrap: 'break-word' }}>
        版权哈希: <br/>
        {displayDna}
      </Card.Meta>
      <Card.Description>
        <p style={{ overflowWrap: 'break-word' }}>
          版权所有者:<br/>
          {owner}
        </p>
      </Card.Description>
    </Card.Content>
    <Card.Content extra style={{ textAlign: 'center' }}>{ owner === currentAccount.address
      ? <TransferModal kitty={kitty} accountPair={currentAccount} setStatus={setStatus}/>
      : ''
    }</Card.Content>
  </Card>
}

const KittyCards = props => {
  const { kitties, setStatus } = props
  const { currentAccount } = useSubstrateState()


  if (kitties.length === 0) {
    return <Message info>
      <Message.Header>现在一个作品也没有，赶快创建一个&nbsp;
        <span role='img' aria-label='point-down'>👇</span>
      </Message.Header>
    </Message>
  }

  return <Grid columns={3}>{kitties.map((kitty, i) =>
    <Grid.Column key={`kitty-${i}`}>
      <KittyCard kitty={kitty} accountPair={currentAccount} setStatus={setStatus}/>
    </Grid.Column>
  //   <Grid.Column key={`kitty-${i}`}>
  //   <KittyCard2 kitty={kitty} accountPair={currentAccount} setStatus={setStatus}/>
  // </Grid.Column>
  )}</Grid>
}

export default KittyCards
