/**
 * WordPress dependencies
 */
import {
	DropZoneProvider,
	Popover,
	SlotFillProvider,
} from '@wordpress/components';
import { createContext } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import {
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import useNavigationEditor from './use-navigation-editor';
import useNavigationBlockEditor from './use-navigation-block-editor';
import useMenuNotifications from './use-menu-notifications';
import ErrorBoundary from '../error-boundary';
import NavigationEditorShortcuts from './shortcuts';
import Header from '../header';
import Notices from '../notices';
import Toolbar from '../toolbar';
import Editor from '../editor';
import InspectorAdditions from '../inspector-additions';
import { store as editNavigationStore } from '../../store';
import useNavigationBlockWithName from './use-navigation-block-with-name';

export const MenuIdContext = createContext();

export default function Layout( { blockEditorSettings } ) {
	const { saveNavigationPost } = useDispatch( editNavigationStore );
	const savePost = () => saveNavigationPost( navigationPost );

	const {
		menus,
		selectedMenuId,
		navigationPost,
		selectMenu,
		deleteMenu,
	} = useNavigationEditor();

	const [ blocks, onInput, onChange ] = useNavigationBlockEditor(
		navigationPost
	);

	useMenuNotifications( selectedMenuId );

	useNavigationBlockWithName( selectedMenuId );

	return (
		<ErrorBoundary>
			<SlotFillProvider>
				<DropZoneProvider>
					<BlockEditorKeyboardShortcuts.Register />
					<NavigationEditorShortcuts.Register />

					<Notices />

					<div className="edit-navigation-layout">
						<Header
							isPending={ ! navigationPost }
							menus={ menus }
							selectedMenuId={ selectedMenuId }
							onSelectMenu={ selectMenu }
						/>

						<MenuIdContext.Provider value={ selectedMenuId }>
							<BlockEditorProvider
								value={ blocks }
								onInput={ onInput }
								onChange={ onChange }
								settings={ {
									...blockEditorSettings,
									templateLock: 'all',
									hasFixedToolbar: true,
								} }
								useSubRegistry={ false }
							>
								<BlockEditorKeyboardShortcuts />
								<NavigationEditorShortcuts
									saveBlocks={ savePost }
								/>
								<Toolbar
									isPending={ ! navigationPost }
									navigationPost={ navigationPost }
								/>
								<Editor
									isPending={ ! navigationPost }
									blocks={ blocks }
								/>
								<InspectorAdditions
									menuId={ selectedMenuId }
									onDeleteMenu={ deleteMenu }
								/>
							</BlockEditorProvider>
						</MenuIdContext.Provider>
					</div>

					<Popover.Slot />
				</DropZoneProvider>
			</SlotFillProvider>
		</ErrorBoundary>
	);
}
