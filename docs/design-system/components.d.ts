import type * as React from 'react';

export type IconName = 'home' | 'search' | 'book' | 'books' | 'clock' | 'user' | 'users' | 'sparkle' | 'chat' | 'qr' | 'scan' | 'bell' | 'check' | 'x' | 'chevronRight' | 'chevronLeft' | 'arrowLeft' | 'filter' | 'alert' | 'info' | 'refresh' | 'calendar' | 'plus' | 'trash' | 'more' | 'send' | 'grip' | 'hand' | 'inbox' | 'coin' | 'logout' | 'keyboard' | 'arrowUpDown' | 'mail' | 'lock' | 'eye' | 'eyeOff' | 'fingerprint' | 'shield' | 'smartphone' | 'pencil' | 'folder' | 'bookmark' | 'globe' | 'image' | 'barcode' | 'help' | 'moon' | 'heart' | 'share' | 'copy' | 'mapPin' | 'wifiOff' | 'checkCircle' | 'logIn' | 'bookmarkFill' | 'externalLink' | 'userPlus';
export type Status = 'disponivel' | 'emprestado' | 'fila' | 'reservado' | 'aguardando' | 'retirar' | 'ativo' | 'vence' | 'atrasado' | 'devolvido' | 'expirado' | 'cancelado';
export type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

export interface IconProps { name: IconName; size?: number; strokeWidth?: number; label?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'tonal' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; block?: boolean; icon?: IconName; iconRight?: IconName; loading?: boolean }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface TextFieldProps { label?: string; value?: string; placeholder?: string; hint?: string; error?: string; icon?: IconName; type?: string; inputMode?: 'text' | 'numeric'; maxLength?: number; trailing?: React.ReactNode; id?: string }
export declare function TextField(props: TextFieldProps): React.ReactElement;
export interface SearchBarProps { value?: string; placeholder?: string; showFilter?: boolean; filtersActive?: boolean }
export declare function SearchBar(props: SearchBarProps): React.ReactElement;
export interface ChipProps { selected?: boolean; icon?: IconName; count?: number; children?: React.ReactNode }
export declare function Chip(props: ChipProps): React.ReactElement;
export interface SegmentedTabsProps { items: { label: string; count?: number }[]; value?: number }
export declare function SegmentedTabs(props: SegmentedTabsProps): React.ReactElement;
export interface StatusBadgeProps { status: Status; label?: string }
export declare function StatusBadge(props: StatusBadgeProps): React.ReactElement;
export interface BookCoverProps { title: string; author?: string; tone?: 1 | 2 | 3 | 4 | 5 | 6; size?: 'sm' | 'md' | 'lg' }
export declare function BookCover(props: BookCoverProps): React.ReactElement;
export interface BookCardProps { title: string; author: string; year?: number; tone?: 1 | 2 | 3 | 4 | 5 | 6; status?: Status; statusLabel?: string; meta?: React.ReactNode; action?: React.ReactNode; layout?: 'row' | 'grid' }
export declare function BookCard(props: BookCardProps): React.ReactElement;
export interface QueueInfoProps { ahead: number; joined?: boolean; note?: string }
export declare function QueueInfo(props: QueueInfoProps): React.ReactElement;
export interface DeadlineChipProps { kind: 'confirmar' | 'retirar' | 'devolver' | 'vence' | 'atrasado' | 'ok' | 'neutro'; children: React.ReactNode }
export declare function DeadlineChip(props: DeadlineChipProps): React.ReactElement;
export interface LoanCardProps { title: string; author: string; tone?: 1 | 2 | 3 | 4 | 5 | 6; status?: Status; statusLabel?: string; progress?: number; startLabel?: string; dueLabel?: string; deadline?: React.ReactNode; renewBlocked?: boolean; renewReason?: string; actions?: React.ReactNode }
export declare function LoanCard(props: LoanCardProps): React.ReactElement;
export interface LoanTimelineProps { steps: { label: string; detail?: string; state?: 'done' | 'current' | 'todo' | 'skipped' }[] }
export declare function LoanTimeline(props: LoanTimelineProps): React.ReactElement;
export interface AlertProps { tone?: 'info' | 'success' | 'warning' | 'danger'; title?: string; children?: React.ReactNode; action?: string; icon?: IconName }
export declare function Alert(props: AlertProps): React.ReactElement;
export interface FineCardProps { amount?: string; daysLate: number; rate?: string; book?: string; note?: string; label?: string; action?: React.ReactNode }
export declare function FineCard(props: FineCardProps): React.ReactElement;
export interface ChatBubbleProps { from?: 'assistant' | 'user'; children?: React.ReactNode; time?: string; typing?: boolean; extra?: React.ReactNode; suggestions?: string[]; name?: string; showName?: boolean }
export declare function ChatBubble(props: ChatBubbleProps): React.ReactElement;
export interface ChatComposerProps { value?: string; placeholder?: string }
export declare function ChatComposer(props: ChatComposerProps): React.ReactElement;
export interface QRPassProps { code: string; matricula: string; name: string; book: string; author?: string; tone?: 1 | 2 | 3 | 4 | 5 | 6; expires?: string; heading?: string }
export declare function QRPass(props: QRPassProps): React.ReactElement;
export interface AppBarProps { title: string; subtitle?: string; back?: boolean; large?: boolean; actions?: { icon: IconName; label: string; badge?: number }[] }
export declare function AppBar(props: AppBarProps): React.ReactElement;
export interface BottomNavProps { role?: 'aluno' | 'bibliotecario'; active?: number; badges?: Record<number, number> }
export declare function BottomNav(props: BottomNavProps): React.ReactElement;
export interface BottomSheetProps { title?: string; text?: string; children?: React.ReactNode; actions?: React.ReactNode }
export declare function BottomSheet(props: BottomSheetProps): React.ReactElement;
export interface StatTileProps { icon?: IconName; value: React.ReactNode; label: string; tone?: Tone }
export declare function StatTile(props: StatTileProps): React.ReactElement;
export interface QueueManagerRowProps { position: number; name: string; matricula: string; since?: string; status?: Status; statusLabel?: string; reorder?: boolean }
export declare function QueueManagerRow(props: QueueManagerRowProps): React.ReactElement;
export interface NotificationItemProps { title: string; text?: string; time?: string; icon?: IconName; tone?: Tone; unread?: boolean; actions?: React.ReactNode }
export declare function NotificationItem(props: NotificationItemProps): React.ReactElement;
export interface AvatarProps { name: string; size?: number }
export declare function Avatar(props: AvatarProps): React.ReactElement;
export interface EmptyStateProps { icon?: IconName; title: string; text?: string; action?: React.ReactNode }
export declare function EmptyState(props: EmptyStateProps): React.ReactElement;

export interface CodeInputProps { length?: number; value?: string; label?: string; hint?: string; error?: string }
export declare function CodeInput(props: CodeInputProps): React.ReactElement;
export interface ListRowProps { title: string; text?: string; icon?: IconName; tone?: Tone; danger?: boolean; chevron?: boolean; trailing?: React.ReactNode }
export declare function ListRow(props: ListRowProps): React.ReactElement;
export interface ToggleProps { checked?: boolean; disabled?: boolean; label?: string }
export declare function Toggle(props: ToggleProps): React.ReactElement;
export interface FolderCardProps { name: string; count: number; icon?: IconName; tone?: Tone }
export declare function FolderCard(props: FolderCardProps): React.ReactElement;
export interface StepperProps { steps: string[]; current?: number; label?: string }
export declare function Stepper(props: StepperProps): React.ReactElement;
export interface FineRowProps { name: string; book: string; amount: string; state?: 'aberto' | 'contando' | 'paga'; meta?: string }
export declare function FineRow(props: FineRowProps): React.ReactElement;
export interface ToastProps { message?: string; children?: React.ReactNode; icon?: IconName; action?: string }
export declare function Toast(props: ToastProps): React.ReactElement;
export interface PromptSugeridoProps { text?: string; children?: React.ReactNode; label?: string }
export declare function PromptSugerido(props: PromptSugeridoProps): React.ReactElement;

declare global { interface Window { UniforBib: { Icon: typeof Icon; Button: typeof Button; TextField: typeof TextField; SearchBar: typeof SearchBar; Chip: typeof Chip; SegmentedTabs: typeof SegmentedTabs; StatusBadge: typeof StatusBadge; BookCover: typeof BookCover; BookCard: typeof BookCard; QueueInfo: typeof QueueInfo; DeadlineChip: typeof DeadlineChip; LoanCard: typeof LoanCard; LoanTimeline: typeof LoanTimeline; Alert: typeof Alert; FineCard: typeof FineCard; ChatBubble: typeof ChatBubble; ChatComposer: typeof ChatComposer; QRPass: typeof QRPass; AppBar: typeof AppBar; BottomNav: typeof BottomNav; BottomSheet: typeof BottomSheet; StatTile: typeof StatTile; QueueManagerRow: typeof QueueManagerRow; NotificationItem: typeof NotificationItem; Avatar: typeof Avatar; EmptyState: typeof EmptyState; CodeInput: typeof CodeInput; ListRow: typeof ListRow; Toggle: typeof Toggle; FolderCard: typeof FolderCard; Stepper: typeof Stepper; FineRow: typeof FineRow; Toast: typeof Toast; PromptSugerido: typeof PromptSugerido; iconNames: IconName[] } } }
