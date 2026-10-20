import { StatusBar } from 'expo-status-bar'
import {
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { useCallback, useEffect, useRef, useState, type ComponentRef } from 'react'
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { ApiError, apiRequest } from './src/api'
import { AUTH_EMAIL_DOMAIN } from './src/config'
import { auth } from './src/firebase'
import { createPasskey, getCustomTokenWithPasskey } from './src/passkey-flows'

// Throwaway screen to test the passkey flow against the local API. Not the real app.

// Formats any error thrown by the API, Firebase or the passkey library.
function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    return `${error.status} ${JSON.stringify(error.body)}`
  }
  if (error instanceof Error) return error.message
  return JSON.stringify(error)
}

export default function App() {
  const [matricula, setMatricula] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [busy, setBusy] = useState(false)
  const [lines, setLines] = useState<string[]>([])
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null)

  const log = useCallback((message: string) => {
    const time = new Date().toLocaleTimeString('en-GB')
    setLines((current) => [...current, `${time} ${message}`])
  }, [])

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  // Runs one action: logs its start, its error (if any) and disables the buttons.
  async function run(title: string, action: () => Promise<void>) {
    setBusy(true)
    log(`> ${title}`)
    try {
      await action()
    } catch (error) {
      log(`ERROR: ${describeError(error)}`)
    } finally {
      setBusy(false)
    }
  }

  const signInWithPassword = () =>
    run('Sign in with password', async () => {
      const email = `${matricula.trim()}@${AUTH_EMAIL_DOMAIN}`
      const credential = await signInWithEmailAndPassword(auth, email, password)
      log(`signed in as ${credential.user.email} (uid=${credential.user.uid})`)
    })

  const createNewPasskey = () =>
    run('Create passkey', async () => {
      if (!auth.currentUser) throw new Error('Sign in with password first.')
      await createPasskey(await auth.currentUser.getIdToken(), log)
    })

  const logOut = () =>
    run('Sign out', async () => {
      await signOut(auth)
      log('signed out')
    })

  const signInWithPasskey = () =>
    run('Sign in with passkey', async () => {
      const customToken = await getCustomTokenWithPasskey(matricula.trim(), log)
      log('signInWithCustomToken')
      const credential = await signInWithCustomToken(auth, customToken)
      log(`signed in (uid=${credential.user.uid})`)
    })

  const showMe = () =>
    run('GET /me', async () => {
      if (!auth.currentUser) throw new Error('Not signed in.')
      const token = await auth.currentUser.getIdToken()
      const me = await apiRequest<unknown>('/me', { token })
      log(JSON.stringify(me, null, 2))
    })

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Text style={styles.title}>Passkey prototype</Text>
        <Text style={styles.status}>
          {user ? `Signed in: ${user.email}` : 'Signed out'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Matricula (7 digits)"
          value={matricula}
          onChangeText={setMatricula}
          keyboardType="number-pad"
          autoCapitalize="none"
          maxLength={7}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          keyboardType="number-pad"
          autoCapitalize="none"
        />

        <View style={styles.buttons}>
          <Button
            label="Sign in with password"
            onPress={signInWithPassword}
            disabled={busy}
          />
          <Button label="Create passkey" onPress={createNewPasskey} disabled={busy} />
          <Button label="Sign out" onPress={logOut} disabled={busy} />
          <Button
            label="Sign in with passkey"
            onPress={signInWithPasskey}
            disabled={busy}
          />
          <Button label="Show /me" onPress={showMe} disabled={busy} />
          <Button label="Clear log" onPress={() => setLines([])} />
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.log}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd()}
        >
          {lines.map((line, index) => (
            <Text key={index} style={styles.logLine} selectable>
              {line}
            </Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

function Button(props: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      style={[styles.button, props.disabled && styles.buttonDisabled]}
    >
      <Text style={styles.buttonText}>{props.label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 16, paddingTop: 40, gap: 10 },
  title: { fontSize: 20, fontWeight: '700' },
  status: { fontSize: 14, color: '#444' },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  button: {
    backgroundColor: '#1f4fbf',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  log: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 6,
    padding: 8,
  },
  logLine: { color: '#9f9', fontFamily: 'monospace', fontSize: 12 },
})
