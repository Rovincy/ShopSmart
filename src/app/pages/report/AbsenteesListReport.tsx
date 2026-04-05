import React, { useEffect, useRef } from "react";
import ko from "knockout";
import "devexpress-reporting/dx-webdocumentviewer";
import "../../../../node_modules/devextreme/dist/css/dx.light.css";
import "../../../../node_modules/devexpress-reporting/dist/css/dx-webdocumentviewer.css";
import "../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css";
import "../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.light.css";
import { Report_URL } from "../../services/ApiCalls";
import { DxReportViewer } from "devexpress-reporting/dx-webdocumentviewer";

const ReportViewer = () => {
    // const {tenant} = useAuth();
    const reportUrl = ko.observable('AbsenteesListReport');
    const viewerRef: any = useRef();
    const requestOptions = {
        host: Report_URL,
        // host: "https://app.sipconsult.net/serverside/",
        invokeAction: "DXXRDV"
    };

    useEffect(() => {
        const viewer = new DxReportViewer(viewerRef.current,
            {
                reportUrl,
                requestOptions,
                callbacks: {
                    // customizeParameterLookUpSource: function (s, e) {
                    //     if (s?.name?.toLowerCase() === 'tenantid') {
                    //         var parametersModel = e.filter(x => x.value === tenant);
                    //         return parametersModel
                    //     }
                    // },
                }
            });
        viewer.render();
        return () => viewer.dispose();
    })
    return (<div ref={viewerRef}></div>);
}

function AbsenteesListReport() {
    return (<div style={{width: "100%", height: "1000px"}}>
        <ReportViewer/>
    </div>);
}

export default AbsenteesListReport;

// import ko from "knockout";
// import "devexpress-reporting/dx-webdocumentviewer";
// // import "../../../../../../node_modules/";
// // import "../../../../../../node_modules/jquery-ui/themes/base/all.css";
// import "../../../../../../node_modules/devextreme/dist/css/dx.light.css";
// import "../../../../../../node_modules/devexpress-reporting/dist/css/dx-webdocumentviewer.css";
// import "../../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css";
// import "../../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.light.css";
// import { Report_URL } from '../../../services/ApiCalls'
// class ReportViewer extends React.Component {
// constructor(props) {
//     super(props);
//     this.reportUrl = ko.observable("AttendanceReport");
//     this.requestOptions = {
//         host: Report_URL,
//         invokeAction: "DXXRDV"
//     };
// }
// render() {
//     return (<div ref="viewer" data-bind="dxReportViewer: $data"></div>);
// }
// componentDidMount() {
//     ko.applyBindings({
//     reportUrl: this.reportUrl,
//     requestOptions: this.requestOptions
//     }, this.refs.viewer);
// }
// componentWillUnmount() {
//     ko.cleanNode(this.refs.viewer);
// }
// };

// function AttendanceReport() {
// return (<div style={{ width: "100%", height: "1000px" }}>
//     <ReportViewer />
// </div>);
// }
// export {AttendanceReport};