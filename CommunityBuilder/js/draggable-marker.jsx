// export default function DraggableMarker({
//     mapcoord1,
//     mapcoord2,
//     setFormValue,
// }) {
//     const [draggable, setDraggable] = useState(false)
//     const [position, setPosition] = useState([mapcoord1, mapcoord2])
//     const markerRef = useRef(null)
//     const eventHandlers = useMemo(
//       () => ({
//         dragend() {
//           const marker = markerRef.current
//           if (marker != null) {
//             latlong = marker.getLatLng()
//             setPosition(latlong)
//             setFormValue()
//           }
//         },
//       }),
//       [],
//     )
//     const toggleDraggable = useCallback(() => {
//       setDraggable((d) => !d)
//     }, [])
  
//     return (
//       <Marker
//         draggable={draggable}
//         eventHandlers={eventHandlers}
//         position={position}
//         ref={markerRef}>
//         <Popup minWidth={90}>
//           <span onClick={toggleDraggable}>
//             {draggable
//               ? 'Marker is draggable'
//               : 'Click here to make marker draggable'}
//           </span>
//         </Popup>
//       </Marker>
//     )
//   }

//   Event.propTypes = {
//     rsvped: PropTypes.bool.isRequired,
//     onClick: PropTypes.func.isRequired,
//     numPeople: PropTypes.number.isRequired,
//     eventId: PropTypes.number.isRequired,
//   };