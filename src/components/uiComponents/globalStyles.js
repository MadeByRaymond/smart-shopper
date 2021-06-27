import {StyleSheet} from 'react-native'

import {dWidth} from '../../includes/variables'

export const globalStyles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: 25,
        paddingHorizontal: 16,
        position: 'relative'
    },
    subtext:{
        fontFamily: "Gilroy-Medium",
        fontSize: 14,
        marginBottom: 15,
        marginTop:10
    },
    scrollView:{
        flex: 1,
    },
    scrollViewContainer:{
        paddingBottom:160
    },

    pageTitleWrapper:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        flexWrap: 'wrap',
        marginBottom:15
    },
    pageTitleText:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 25,
    },


    // List Actions Style 
    categoryWrapper:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    listItem:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#ECECEE',
        borderBottomWidth: 1,
        borderStyle: 'solid',

        paddingHorizontal: 3,
        paddingBottom: 20,
        marginBottom: 20
    },
    listItemLeft:{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,

        paddingRight: 20,

        maxWidth: dWidth - (26 * 2) - 26 - 6 - 5
    },
    listItemRight:{
        flexDirection: 'row',
        // flex: 1
    },
    listItemTitleWrapper:{
        flex: 1
    },
    listItemTitle:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 16,
    },
    listItemTitleCrossed:{
        textDecorationLine: 'line-through',
        color: '#979AA9'
    },
    listItemSubtext:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 15,

        color: '#9FA2B0'
    },


    // Modal Styles
    modalBgWrapper:{
        flex: 1, 
        backgroundColor: 'transparent',
        justifyContent: 'flex-end'
    },
    modalBg:{
        paddingHorizontal: 26,
        paddingTop: 48,
        paddingBottom: 30,
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        elevation: -10
    },
    modalTitle:{
        fontFamily: 'Gilroy-Medium', 
        fontSize: 22,

        marginBottom: 17
    },
})
